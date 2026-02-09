const client = require("../config/mercadopago")
const { Preference, Payment } = require("mercadopago")
const { getOrderByIdForPayment, savePaymentInfo, updateOrderStatus } = require("../models/Order")

/* ===============================
   CREAR PREFERENCIA DE PAGO
================================ */
const createMercadoPagoPreference = async (req, res) => {
  try {
    console.log("FRONTEND_URL 👉", process.env.FRONTEND_URL)
    console.log("NODE_ENV 👉", process.env.NODE_ENV)
    console.log("BACKEND_URL 👉", process.env.BACKEND_URL)
    
    const { orderId } = req.body

    const order = await getOrderByIdForPayment(orderId)

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" })
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "La orden ya no está pendiente" })
    }

    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [
          {
            title: `Orden #${order.id}`,
            quantity: 1,
            unit_price: Number(order.total),
            currency_id: "PEN"
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/`,
          failure: `${process.env.FRONTEND_URL}/`,
          pending: `${process.env.FRONTEND_URL}/`
        },
        auto_return: "approved",
        external_reference: String(order.id),
        notification_url: `${process.env.BACKEND_URL}/webhooks/mercadopago`
      }
    })

    await savePaymentInfo({
      orderId: order.id,
      paymentProvider: "mercadopago",
      paymentId: response.id,
      paymentUrl: response.init_point
    })

    res.json({ paymentUrl: response.init_point })
  } catch (error) {
        console.error("❌ Error Mercado Pago FULL:", {
        message: error.message,
        status: error.status,
        error: error.error,
        cause: error.cause,
        stack: error.stack
    })

    res.status(500).json({
        message: "Error creando pago",
        detail: error.message
    })
  }
}

/* ===============================
   WEBHOOK MERCADO PAGO
================================ */
const mercadopagoWebhook = async (req, res) => {
  try {
    console.log("📩 WEBHOOK RAW:", req.body)

    const paymentId = req.body?.data?.id
    if (!paymentId) return res.sendStatus(200)

    const payment = new Payment(client)
    const paymentInfo = await payment.get({ id: paymentId })

    const status = paymentInfo.status
    const orderId = paymentInfo.external_reference

    console.log("💳 PAGO:", { status, orderId })

    if (status === "approved" && orderId) {
      await updateOrderStatus(orderId, "paid")
      console.log("✅ ORDEN MARCADA COMO PAGADA")
    }

    res.sendStatus(200)
  } catch (error) {
    console.error("❌ Error webhook MP:", error)
    res.sendStatus(200) // siempre 200
  }
}

module.exports = {
  createMercadoPagoPreference,
  mercadopagoWebhook
}