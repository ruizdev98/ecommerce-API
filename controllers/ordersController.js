// src/controllers/orders.controller.js
const OrdersModel = require("../models/Order")

/**
 * POST /orders
 * Crear una nueva orden
 */
const createOrder = async (req, res) => {
  try {
    // 🔐 userId viene del middleware de auth
    const userId = req.user.uid

    const {
      deliveryMethod,
      totals,
      shipping,
      items
    } = req.body

    // 🛑 Validaciones mínimas (nivel HTTP)
    if (!deliveryMethod || !totals || !items?.length) {
      return res.status(400).json({
        message: "Datos incompletos para crear la orden"
      })
    }

    if (!["home", "store"].includes(deliveryMethod)) {
      return res.status(400).json({
        message: "Método de entrega inválido"
      })
    }

    if (deliveryMethod === "home" && !shipping) {
      return res.status(400).json({
        message: "Datos de envío requeridos"
      })
    }

    /* ================= ORDEN PENDIENTE ================= */

    const pendingOrder = await OrdersModel.getPendingOrderByUser(userId)

    if (pendingOrder) {
        return res.status(200).json({
            message: "Orden pendiente existente",
            orderId: pendingOrder.id,
            reused: true
        })
    }

    // 📦 Crear orden (toda la lógica está en el model)
    const order = await OrdersModel.createOrder({
        userId,
        deliveryMethod,
        totals,
        shipping,
        items
    })

    return res.status(201).json({
        message: "Orden creada correctamente",
        orderId: order.id,
        reused: false
    })

  } catch (error) {
    console.error("❌ createOrder error:", error)

    return res.status(500).json({
      message: error.message || "Error al crear la orden"
    })
  }
}

/**
 * GET /orders/:id
 * Obtener orden completa (resumen / pago)
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.uid
    const { id } = req.params

    const order = await OrdersModel.getOrderById(id, userId)

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada"
      })
    }

    return res.json(order)

  } catch (error) {
    console.error("❌ getOrderById error:", error)

    return res.status(500).json({
      message: "Error al obtener la orden"
    })
  }
}

/**
 * PATCH /orders/:id/status
 * Actualizar estado de la orden
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatus = [
      "pending",
      "paid",
      "shipped",
      "completed",
      "cancelled"
    ]

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Estado de orden inválido"
      })
    }

    const order = await OrdersModel.updateOrderStatus(id, status)

    return res.json({
      message: "Estado actualizado",
      order
    })

  } catch (error) {
    console.error("❌ updateOrderStatus error:", error)

    return res.status(500).json({
      message: "Error al actualizar el estado"
    })
  }
}

/**
 * GET /orders/pending
 * Obtener la última orden pendiente del usuario
 */
const getPendingOrder = async (req, res) => {
  try {
    const userId = req.user.uid

    const order = await OrdersModel.getPendingOrderByUser(userId)

    if (!order) {
      return res.json({ order: null })
    }

    return res.json({
      orderId: order.id
    })

  } catch (error) {
    console.error("❌ getPendingOrder error:", error)

    return res.status(500).json({
      message: "Error al obtener orden pendiente"
    })
  }
}
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.uid
    const { id } = req.params

    const order = await OrdersModel.cancelOrder(id, userId)

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada o no se puede cancelar"
      })
    }

    return res.json({
      message: "Orden cancelada correctamente",
      order
    })

  } catch (error) {
    console.error("❌ cancelOrder error:", error)

    return res.status(500).json({
      message: "Error al cancelar la orden"
    })
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getPendingOrder,
  cancelOrder
}
