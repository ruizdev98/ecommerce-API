const Size = require("../models/Size");

async function getAllSizers(req, res) {
  try {
    const genders = await Size.getAll();
    res.json(genders);
  } catch (error) {
    console.error('Error al obtener sizes:', error);
    res.status(500).json({ error: 'Error al obtener sizes' });
  }
}

module.exports = {
  getAllSizers,
};