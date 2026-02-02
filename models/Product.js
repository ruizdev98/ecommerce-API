const pool = require("../db");
const { keysToCamelCase } = require("../utils/camelCase");

async function findAll() {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
  `);
  return keysToCamelCase(result.rows);
}

async function findBestSellers() {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.is_best_seller = true
  `);
  return keysToCamelCase(result.rows);
}

async function findFeatured() {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.is_featured = true
  `);
  return keysToCamelCase(result.rows);
}

async function findOffers() {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.is_offer = true
  `);
  return keysToCamelCase(result.rows);
}

async function findById(id) {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.id = $1
  `, [id]);

  const rows = keysToCamelCase(result.rows);
  return rows[0] || null; // devolver null si no existe
}

module.exports = {
  findAll,
  findBestSellers,
  findFeatured,
  findOffers,
  findById,
};