const Departments = require("../models/Departments");

async function getAllDepartments(req, res) {
  try {
    const departments = await Departments.getAll();
    res.json(departments);
  } catch (error) {
    console.error("Error al obtener departments:", error);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
}

module.exports = {
  getAllDepartments,
};