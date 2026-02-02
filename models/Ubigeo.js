const pool = require("../db");
const { keysToCamelCase } = require("../utils/camelCase");

/**
 * Obtener todos los departamentos
 */
async function findDepartments() {
  const result = await pool.query(`
    SELECT DISTINCT department_name
    FROM ubigeo_peru
    ORDER BY department_name
  `);

  return keysToCamelCase(result.rows);
}

/**
 * Obtener provincias por departamento
 */
async function findProvincesByDepartment(departmentName) {
  const result = await pool.query(`
    SELECT DISTINCT province_name
    FROM ubigeo_peru
    WHERE department_name = $1
    ORDER BY province_name
  `, [departmentName]);

  return keysToCamelCase(result.rows);
}

/**
 * Obtener distritos por departamento y provincia
 */
async function findDistricts(departmentName, provinceName) {
  const result = await pool.query(`
    SELECT
      iddist,
      district_name,
      capital,
      region_code,
      natural_region
    FROM ubigeo_peru
    WHERE department_name = $1
      AND province_name = $2
    ORDER BY district_name
  `, [departmentName, provinceName]);

  return keysToCamelCase(result.rows);
}

/**
 * Obtener ubigeo completo por iddist (útil para órdenes)
 */
async function findByIddist(iddist) {
  const result = await pool.query(`
    SELECT *
    FROM ubigeo_peru
    WHERE iddist = $1
  `, [iddist]);

  const rows = keysToCamelCase(result.rows);
  return rows[0] || null;
}

module.exports = {
  findDepartments,
  findProvincesByDepartment,
  findDistricts,
  findByIddist,
};