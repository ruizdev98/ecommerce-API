const Ubigeo = require("../models/Ubigeo");

/**
 * GET /api/ubigeo/departments
 */
async function getDepartments(req, res) {
  try {
    const departments = await Ubigeo.findDepartments();
    res.json(departments);
  } catch (error) {
    console.error("Error getting departments:", error);
    res.status(500).json({ message: "Error al obtener departamentos" });
  }
}

/**
 * GET /api/ubigeo/provinces?department=LIMA
 */
async function getProvincesByDepartment(req, res) {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ message: "department es requerido" });
    }

    const provinces = await Ubigeo.findProvincesByDepartment(department);
    res.json(provinces);
  } catch (error) {
    console.error("Error getting provinces:", error);
    res.status(500).json({ message: "Error al obtener provincias" });
  }
}

/**
 * GET /api/ubigeo/districts?department=LIMA&province=LIMA
 */
async function getDistricts(req, res) {
  try {
    const { department, province } = req.query;

    if (!department || !province) {
      return res.status(400).json({
        message: "department y province son requeridos",
      });
    }

    const districts = await Ubigeo.findDistricts(department, province);
    res.json(districts);
  } catch (error) {
    console.error("Error getting districts:", error);
    res.status(500).json({ message: "Error al obtener distritos" });
  }
}

/**
 * GET /api/ubigeo/:iddist
 */
async function getUbigeoByIddist(req, res) {
  try {
    const { iddist } = req.params;

    const ubigeo = await Ubigeo.findByIddist(iddist);

    if (!ubigeo) {
      return res.status(404).json({ message: "Ubigeo no encontrado" });
    }

    res.json(ubigeo);
  } catch (error) {
    console.error("Error getting ubigeo:", error);
    res.status(500).json({ message: "Error al obtener ubigeo" });
  }
}

module.exports = {
  getDepartments,
  getProvincesByDepartment,
  getDistricts,
  getUbigeoByIddist,
};