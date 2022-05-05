// Write your tests here
const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");

const password = "1234";
const salt = 8;

const generateHash = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
  await db("users").insert([
    {
      username: "Black Widow",
      password: generateHash(password, salt),
    },
    {
      username: "Spiderman",
      password: generateHash(password, salt),
    },
    {
      username: "Black Panther",
      password: generateHash(password, salt),
    },
  ]);
});

afterAll(async () => {
  await db.destroy();
});

test("[1] sanity", () => {
  expect(true).not.toBe(false);
});

test("[2] make sure our environment is set correctly", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("Can We Pass Them All?", () => {
  test("Post a new User", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Iron Man", password: "1234" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 4, username: "Iron Man" });
  });

  test("Username Taken", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Black Widow", password: "1234" });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "username taken");
  });

  test("Can we login?", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "Black Widow", password: "1234" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "welcome!");
  });

  test("Wrong Password", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "john", password: "5678" });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "invalid credentials");
  });

  test("Gotts have a token", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "token required");
  });

  test("Can We Get Some Jokes?", async () => {
    const login = await request(server)
      .post("/api/auth/login")
      .send({ username: "Black Widow", password: "1234" });
    const res = await request(server).get("/api/jokes").set("Authorization", login.body.token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
});