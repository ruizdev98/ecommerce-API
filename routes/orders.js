// src/routes/orders.routes.js
const express = require("express")
const router = express.Router()
const ordersController = require("../controllers/ordersController")
const authMiddleware = require("../middlewares/firebaseAuth")

router.post("/", authMiddleware, ordersController.createOrder)
router.get("/pending", authMiddleware, ordersController.getPendingOrder)
router.get("/:id", authMiddleware, ordersController.getOrderById)
router.patch("/:id/status", authMiddleware, ordersController.updateOrderStatus)
router.put("/:id/cancel", authMiddleware, ordersController.cancelOrder)

module.exports = router
