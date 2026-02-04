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
          success: `${process.env.FRONTEND_URL}/checkout/success`,
          failure: `${process.env.FRONTEND_URL}/checkout/failure`,
          pending: `${process.env.FRONTEND_URL}/checkout/pending`
        },
        //auto_return: "approved", (en producción)
        external_reference: String(order.id)
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
    const { type, data } = req.body

    if (type !== "payment") {
      return res.sendStatus(200)
    }

    if (!data?.id) {
      console.warn("Webhook MP sin data.id", req.body)
      return res.sendStatus(200)
    }

    const payment = new Payment(client)
    const paymentResponse = await payment.get({ id: data.id })

    const paymentBody = paymentResponse?.body

    if (!paymentBody) {
      console.warn("Payment body vacío", paymentResponse)
      return res.sendStatus(200)
    }

    const status = paymentBody.status
    const orderId = paymentBody.external_reference

    console.log("Webhook MP:", {
      paymentId: data.id,
      status,
      orderId
    })

    if (status === "approved" && orderId) {
      await updateOrderStatus(orderId, "paid")
    }

    res.sendStatus(200)
  } catch (error) {
    console.error("❌ Error webhook MP:", error)
    res.sendStatus(200) // IMPORTANTE: siempre 200 para que MP no reintente infinito
  }
}

module.exports = {
  createMercadoPagoPreference,
  mercadopagoWebhook
}