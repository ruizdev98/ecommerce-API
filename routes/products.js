// routes/products.js
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.get("/", productsController.getProducts);
router.get("/filters", productsController.getProductFilters);
router.get("/:id", productsController.getProductById);

module.exports = router;