const Gender = require("../models/Gender");

async function getAllGenders(req, res) {
  try {
    const genders = await Gender.getAll();
    res.json(genders);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
}

module.exports = {
  getAllGenders,
};