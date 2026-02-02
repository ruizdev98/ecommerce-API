const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// 📌 Obtener el carrito del usuario
router.get("/", cartController.getCart);

// 📌 Reemplazar los items del carrito (sincronización completa)
router.put("/", cartController.updateCart);

module.exports = router;