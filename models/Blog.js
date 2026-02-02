const pool = require("../db");
const { keysToCamelCase } = require("../utils/camelCase");

async function getAll() {
  const result = await pool.query("SELECT * FROM blogs");
  return keysToCamelCase(result.rows);
}

module.exports = {
  getAll,
}