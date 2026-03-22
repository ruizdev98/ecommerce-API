const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyToken = require("../middlewares/auth.middleware");

// 📌 Obtener el carrito del usuario
router.get("/", verifyToken, cartController.getCart);

// 📌 Reemplazar los items del carrito (sincronización completa)
router.put("/", verifyToken, cartController.updateCart);

module.exports = router;