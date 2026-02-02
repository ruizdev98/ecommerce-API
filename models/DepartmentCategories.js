const pool = require("../db");
const { keysToCamelCase } = require("../utils/camelCase");

async function findAll() {
  const result = await pool.query("SELECT * FROM department_categories");
  return keysToCamelCase(result.rows);
}

async function findDepartmentCategoriesByDepartment(departmentName) {
  const query = `
    SELECT 
        d.name AS department_name,
        c.name AS category_name,
        c.id AS category_id,
        c.image AS category_image
    FROM departments d
    INNER JOIN department_categories dc ON d.id = dc.department_id
    INNER JOIN categories c ON c.id = dc.category_id
    WHERE d.name = $1
    ORDER BY c.name;
  `;

  const result = await pool.query(query, [departmentName]);
  return keysToCamelCase(result.rows);
}

module.exports = {
  findAll,
  findDepartmentCategoriesByDepartment,
}