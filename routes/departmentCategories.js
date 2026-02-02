const express = require("express");
const router = express.Router();
const departmentCategoriesController = require("../controllers/departmentCategoriesController");

router.get("/", departmentCategoriesController.getAllDepartmentCategories);
// Categorías por nombre de departamento
router.get("/:name/categories", departmentCategoriesController.getCategoriesByDepartment);

module.exports = router;