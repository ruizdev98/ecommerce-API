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

async function findProducts({
  categoryId,
  brand,
  minPrice,
  maxPrice,
  bestSeller,
  featured,
  offer,
  limit
}) {
  let query = `
    SELECT p.*, b.name AS brand_name, c.name AS category_name
    FROM products p
    INNER JOIN brands b ON p.brand_id = b.id
    INNER JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `

  const values = []
  let index = 1

  // 🔥 CATEGORY
  if (categoryId) {
    query += ` AND p.category_id = $${index++}`
    values.push(categoryId)
  }

  // 🔥 BRAND (array)
  if (brand && brand.length > 0) {
    query += ` AND b.name = ANY($${index++})`
    values.push(brand)
  }

  // 🔥 PRECIO
  if (minPrice) {
    query += ` AND COALESCE(p.discount_price, p.price) >= $${index++}`
    values.push(minPrice)
  }

  if (maxPrice) {
    query += ` AND COALESCE(p.discount_price, p.price) <= $${index++}`
    values.push(maxPrice)
  }

  // 🔥 BEST SELLER
  if (bestSeller === true) {
    query += ` AND p.is_best_seller = true`
  }

  // 🔥 FEATURED
  if (featured === true) {
    query += ` AND p.is_featured = true`
  }

  // 🔥 OFFERS
  if (offer === true) {
    query += ` AND p.is_offer = true`
  }

  // 🔥 ORDEN
  query += ` ORDER BY p.id DESC`

  // 🔥 LIMIT
  if (limit) {
    query += ` LIMIT ${limit}`
  }

  const result = await pool.query(query, values)
  return keysToCamelCase(result.rows)
}

module.exports = {
  findAll,
  findById,
  findByCategory,
  getFilters,
  findProducts
};