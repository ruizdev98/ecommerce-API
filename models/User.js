const db = require("../db");
const { keysToCamelCase } = require("../utils/camelCase");

const findById = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  )
  return rows[0] ? keysToCamelCase(rows[0]) : null
}

const create = async ({ id, email, first_name, last_name }) => {
  const { rows } = await db.query(
    `
    INSERT INTO users (id, email, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING
    RETURNING *
    `,
    [id, email, first_name, last_name]
  )
  return rows[0] ? keysToCamelCase(rows[0]) : null
}

module.exports = {
  findById,
  create
}