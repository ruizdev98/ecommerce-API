// routes/brands.js
const express = require("express");
const router = express.Router();
const sizesController = require("../controllers/sizesController");

// Obtener todas las categorías
router.get("/", sizesController.getAllSizers);

module.exports = router;