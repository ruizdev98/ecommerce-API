// routes/products.js
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.get("/", productsController.getAllProducts);
router.get("/bestsellers", productsController.getBestSellerProducts);
router.get("/featured", productsController.getFeaturedProducts);
router.get("/offers", productsController.getOfferProducts);
router.get("/:id", productsController.getProductById);

module.exports = router;