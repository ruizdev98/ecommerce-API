const express = require("express")
const router = express.Router()
const paymentsController = require("../controllers/paymentsController")

// 1️⃣ Crear preferencia de pago (frontend llama a esto)
router.post("/mercadopago", paymentsController.createMercadoPagoPreference)

// 2️⃣ Webhook (Mercado Pago llama a esto)
router.post("/webhook", paymentsController.mercadopagoWebhook)

module.exports = router
