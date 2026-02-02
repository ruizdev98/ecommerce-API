// routes/genders.js
const express = require("express");
const router = express.Router();
const gendersController = require("../controllers/gendersController");

// Obtener todas los géneros
router.get("/", gendersController.getAllGenders);

module.exports = router;