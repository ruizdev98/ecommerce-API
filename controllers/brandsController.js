const Brand = require("../models/Brand");

async function getAllBrands(req, res) {
  try {
    const brands = await Brand.getAll();
    res.json(brands);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
}

module.exports = {
  getAllBrands,
};