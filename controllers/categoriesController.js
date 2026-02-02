const Category = require("../models/Category");

async function getAllCategories(req, res) {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
}

module.exports = {
  getAllCategories,
};