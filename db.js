const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Usando SSL:", isProduction);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  family: 4
});

pool.on("connect", () => {
  console.log("✅ Conectado a PostgreSQL")
})

pool.on("error", (err) => {
  console.error("❌ Error inesperado en PostgreSQL", err);
  process.exit(1);
});

module.exports = pool;
