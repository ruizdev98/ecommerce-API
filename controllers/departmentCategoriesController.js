const DepartmentCategories = require("../models/DepartmentCategories");

async function getAllDepartmentCategories(req, res) {
  try {
    const departmentCategories = await DepartmentCategories.findAll();
    res.json(departmentCategories);
  } catch (error) {
    console.error("Error al obtener department_categories:", error);
    res.status(500).json({ error: "Error al obtener las relaciones departamento-categoría" });
  }
}

async function getCategoriesByDepartment(req, res) {
  try {
    const { name } = req.params; // ← "Hombre", "Mujer", etc.
    const categories = await DepartmentCategories.findDepartmentCategoriesByDepartment(name);

    if (categories.length === 0) {
      return res.status(404).json({ message: `No se encontraron categorías para el departamento: ${name}` });
    }

    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías por departamento:", error);
    res.status(500).json({ error: "Error al obtener las categorías del departamento" });
  }
}

module.exports = {
  getAllDepartmentCategories,
  getCategoriesByDepartment,
};