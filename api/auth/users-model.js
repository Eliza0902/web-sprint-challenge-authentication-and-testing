
const db = require("../../data/dbConfig");

const findById = (id) => {
  return db("users").where({ id }).first();
};

const findBy = (filter) => {
  return db("users").where(filter).first();
};

const insert = async (user) => {
  const [id] = await db("users").insert(user);
  return findById(id);
};

module.exports = { findById, findBy, insert };