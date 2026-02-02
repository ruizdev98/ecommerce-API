// routes/departments.js
const express = require("express");
const router = express.Router();
const departmentsController = require("../controllers/departmentsController");

// Obtener todas los géneros
router.get("/", departmentsController.getAllDepartments);

module.exports = router;