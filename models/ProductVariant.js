const pool = require("../db");
const { keysToCamelCase } = require("../utils/camelCase");

async function findByProductId(productId) {
  const result = await pool.query(`
    SELECT 
      pv.id,
      pv.product_id,
      pv.sku,
      pv.stock,
      c.id AS color_id,
      c.name AS color_name,
      c.hex_code AS color_hex,
      s.id AS size_id,
      s.name AS size_name
    FROM product_variants pv
    INNER JOIN colors c ON pv.color_id = c.id
    INNER JOIN sizes s ON pv.size_id = s.id
    WHERE pv.product_id = $1
    ORDER BY c.id, s.id
  `, [productId]);

  return keysToCamelCase(result.rows);
}

async function findAvailableColorsByProductId(productId) {
  const result = await pool.query(`
    SELECT DISTINCT
      c.id,
      c.name,
      c.hex_code
    FROM product_variants pv
    INNER JOIN colors c ON pv.color_id = c.id
    WHERE pv.product_id = $1
      AND pv.stock > 0
    ORDER BY c.name
  `, [productId]);

  return keysToCamelCase(result.rows);
}

async function findAvailableSizesByProductId(productId) {
  const result = await pool.query(`
    SELECT DISTINCT
      s.id,
      s.name
    FROM product_variants pv
    INNER JOIN sizes s ON pv.size_id = s.id
    WHERE pv.product_id = $1
      AND pv.stock > 0
    ORDER BY s.name
  `, [productId]);

  return keysToCamelCase(result.rows);
}

async function findOne(variantId) {
  const result = await pool.query(`
    SELECT 
      pv.*,
      c.name AS color_name,
      c.hex_code AS color_hex,
      s.name AS size_name
    FROM product_variants pv
    INNER JOIN colors c ON pv.color_id = c.id
    INNER JOIN sizes s ON pv.size_id = s.id
    WHERE pv.id = $1
  `, [variantId]);

  return result.rows.length ? keysToCamelCase(result.rows[0]) : null;
}

module.exports = {
  findByProductId,
  findAvailableColorsByProductId,
  findAvailableSizesByProductId,
  findOne,
};