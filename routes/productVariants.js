const express = require("express");
const router = express.Router();
const productVariantsController = require("../controllers/productVariantsController");

router.get('/product/:productId', productVariantsController.getVariantsByProduct);
router.get('/product/:productId/colors', productVariantsController.getAvailableColorsByProduct);
router.get('/product/:productId/sizes', productVariantsController.getAvailableSizesByProduct);
router.get("/:variantId", productVariantsController.getVariantById);

module.exports = router;