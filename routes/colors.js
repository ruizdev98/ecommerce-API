// routes/colors.js
const express = require("express");
const router = express.Router();
const colorsController = require("../controllers/colorsController");

// Obtener todas las categorías
router.get("/", colorsController.getAllColors);

module.exports = router;