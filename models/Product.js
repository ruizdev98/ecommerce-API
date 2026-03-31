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
async function findBestSellersLimit8() {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.is_best_seller = true
    ORDER BY p.discount_price ASC
    LIMIT 8
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
async function findFeaturedLimit8() {
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.is_featured = true
    ORDER BY p.discount_price ASC
    LIMIT 8
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

async function findByCategory(categoryId) {
  const categoryIdInt = parseInt(categoryId)
  if (isNaN(categoryIdInt)) {
    throw new Error("categoryId inválido")
  }
  const result = await pool.query(`
    SELECT p.*, b.name AS brand_name, c.name AS category_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = $1
  `, [categoryIdInt])

  return keysToCamelCase(result.rows)
}

async function findWithFilters({ categoryId, brand, minPrice, maxPrice }) {
  let query = `
    SELECT p.*, b.name AS brand_name, c.name AS category_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    INNER JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `
  const values = []
  let index = 1

  if (categoryId) {
    query += ` AND p.category_id = $${index++}`
    values.push(categoryId)
  }

  if (brand && brand.length > 0) {
    query += ` AND b.name = ANY($${index++})`
    values.push(brand)
  }

  if (minPrice) {
    query += ` AND COALESCE(p.discount_price, p.price) >= $${index++}`
    values.push(minPrice)
  }

  if (maxPrice) {
    query += ` AND COALESCE(p.discount_price, p.price) <= $${index++}`
    values.push(maxPrice)
  }

  const result = await pool.query(query, values)
  return keysToCamelCase(result.rows)
}

async function getFilters(categoryId) {
  const result = await pool.query(`
    SELECT DISTINCT b.name AS brand_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    WHERE p.category_id = $1
  `, [categoryId])

  return {
    brands: keysToCamelCase(result.rows.map(r => r.brand_name))
  }
}

module.exports = {
  findAll,
  findBestSellers,
  findBestSellersLimit8,
  findFeatured,
  findFeaturedLimit8,
  findOffers,
  findById,
  findByCategory,
  findWithFilters,
  getFilters
};