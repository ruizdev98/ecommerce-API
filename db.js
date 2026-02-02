const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Usando SSL:", isProduction);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
