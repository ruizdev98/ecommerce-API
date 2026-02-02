const Color = require("../models/Color");

async function getAllColors(req, res) {
  try {
    const colors = await Color.getAll();
    res.json(colors);
  } catch (error) {
    console.error("Error al obtener colores:", error);
    res.status(500).json({ error: "Error al obtener colores" });
  }
}

module.exports = {
  getAllColors,
};