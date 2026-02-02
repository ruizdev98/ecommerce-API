// routes/brands.js
const express = require("express");
const router = express.Router();
const brandsController = require("../controllers/brandsController");

// Obtener todas las categorías
router.get("/", brandsController.getAllBrands);

module.exports = router;