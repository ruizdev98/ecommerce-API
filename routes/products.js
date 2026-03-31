// routes/products.js
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.get("/", productsController.getProducts);
router.get("/bestsellers", productsController.getBestSellerProducts);
router.get("/bestsellersLimit8", productsController.getBestSellerProductsLimit8);
router.get("/featured", productsController.getFeaturedProducts);
router.get("/featuredLimit8", productsController.getFeaturedProductsLimit8);
router.get("/offers", productsController.getOfferProducts);
router.get("/filters", productsController.getProductFilters);
router.get("/:id", productsController.getProductById);

module.exports = router;