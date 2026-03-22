// src/models/orders.model.js
const db = require("../db")
const { keysToCamelCase } = require("../utils/camelCase");

/**
 * Crear una orden completa:
 * - orders
 * - order_shipping
 * - order_items
 */
const createOrder = async ({
    userId,
    deliveryMethod,
    totals,
    shipping,
    items
}) => {

    const client = await db.connect()

    try {
        await client.query("BEGIN")

        /* ================= VALIDACIONES ================= */

        // 🔒 Validar cantidad total de productos
        const calculatedTotalItems = items.reduce((acc, item) => acc + Number(item.quantity), 0)

        if (calculatedTotalItems <= 0) {
            throw new Error("La orden debe tener al menos un producto")
        }

        /* ================= CREAR ORDEN ================= */
        const DELIVERY_COST = 10
        const deliveryCost = deliveryMethod === "home" ? DELIVERY_COST : 0
        const finalTotal = Number(totals.subtotal) - Number(totals.discount) + deliveryCost

        // 1️⃣ Crear orden
        const orderRes = await client.query(`
        INSERT INTO orders (
            user_id,
            delivery_method,
            total_items,
            subtotal,
            discount,
            delivery_cost,
            total
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id
        `, [
            userId,
            deliveryMethod,
            calculatedTotalItems,
            totals.subtotal,
            totals.discount,
            deliveryCost,
            finalTotal
        ])

        const orderId = orderRes.rows[0].id

        // 2️⃣ Shipping
        if (deliveryMethod === "home") {
            if (!shipping?.ubigeo || shipping.ubigeo.length !== 6) {
                throw new Error("Ubigeo inválido")
        }

        await client.query(`
            INSERT INTO order_shipping (
                order_id,
                name,
                lastname,
                document_type,
                document_number,
                phone,
                ubigeo,
                address,
                reference
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `, [
            orderId,
            shipping.name,
            shipping.lastname,
            shipping.documentType,
            shipping.documentNumber,
            shipping.phone,
            shipping.ubigeo,
            shipping.address,
            shipping.reference
        ])
        }

        // 3️⃣ Items
        // 🔥 1. Obtener todos los product_id de una sola vez
        const variantIds = items.map(i => Number(i.variantId))

        const variantsRes = await client.query(
            `SELECT id, product_id FROM product_variants WHERE id = ANY($1)`,
            [variantIds]
        )

        if (variantsRes.rows.length !== variantIds.length) {
            throw new Error("Algunos variants no existen")
        }
        
        const variantMap = {}
        variantsRes.rows.forEach(v => {
            variantMap[v.id] = v.product_id
        })

        for (const item of items) {
            const productId = variantMap[item.variantId]
            if (!productId) {
                throw new Error(`Variant inválido: ${item.variantId}`)
            }
        await client.query(`
            INSERT INTO order_items (
                order_id,
                product_id,
                variant_id,
                product_name,
                price,
                quantity,
                total
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            `, [
                orderId,
                productId,     // 🔑 ESTE FALTABA
                Number(item.variantId),
                item.productName,
                Number(item.unitPrice),
                Number(item.quantity),
                Number(item.total)
            ])
        }

        await client.query("COMMIT")
        return { id: orderId }

    } catch (error) {
        await client.query("ROLLBACK")
        console.error("❌ Error en createOrder:", error)
        throw error
    } finally {
        client.release()
    }
}

/**
 * Obtener una orden completa (para pago / resumen)
 */
const getOrderById = async (orderId, userId) => {

    // 1️⃣ ORDEN
    const orderResult = await db.query(
        `
        SELECT *
        FROM orders
        WHERE id = $1 AND user_id = $2
        `,
        [orderId, userId]
    )

    const order = orderResult.rows[0]
    if (!order) return null

    // 2️⃣ ITEMS
    const itemsResult = await db.query(
        `
        SELECT
            oi.id,
            oi.product_id,
            oi.variant_id,
            oi.product_name,
            oi.price,
            oi.quantity,
            oi.total,
            p.image,
            pv.sku,
            b.name AS brand_name,
            s.name as size_name,
            c.name as color_name
        FROM order_items oi
        INNER JOIN products p ON p.id = oi.product_id
        INNER JOIN product_variants pv ON pv.id = oi.variant_id
        INNER JOIN brands b ON b.id = p.brand_id
        INNER JOIN sizes s ON s.id = pv.size_id
        INNER JOIN colors c ON c.id = pv.color_id
        WHERE oi.order_id = $1
        `,
        [orderId]
    )

    // 3️⃣ SHIPPING
    const shippingResult = await db.query(
        `
        SELECT *
        FROM order_shipping
        WHERE order_id = $1
        `,
        [orderId]
    )

    const shipping = shippingResult.rows[0] || null

    return keysToCamelCase({
        ...order,
        items: itemsResult.rows,
        shipping
    })
}

const getOrderByIdForPayment = async (orderId) => {
  const res = await db.query(`
    SELECT id, total, status
    FROM orders
    WHERE id = $1
  `, [orderId])

  return res.rows[0] || null
}

/**
 * Actualizar estado de la orden (paid, shipped, etc)
 */
const updateOrderStatus = async (orderId, status) => {
    const res = await db.query(`
        UPDATE orders
        SET status = $2
        WHERE id = $1
        RETURNING *
  `, [orderId, status])

  return keysToCamelCase(res.rows[0])
}

// Obtener la última orden pendiente del usuario
const getPendingOrderByUser = async (userId) => {
    const res = await db.query(`
        SELECT id
        FROM orders
        WHERE user_id = $1
        AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT 1
    `, [userId])

    if (!res.rows.length) return null

    return keysToCamelCase(res.rows[0])
}

const cancelOrder = async (orderId, userId) => {
    const res = await db.query(`
        UPDATE orders
        SET status = 'cancelled'
        WHERE id = $1
        AND user_id = $2
        AND status = 'pending'
        RETURNING *
    `, [orderId, userId])

    if (!res.rows.length) return null

    return keysToCamelCase(res.rows[0])
}

const savePaymentInfo = async ({ orderId, paymentId, paymentUrl }) => {
  const query = `
    UPDATE orders
    SET 
      payment_provider = 'mercadopago',
      payment_id = $1,
      payment_url = $2
    WHERE id = $3
  `
  await db.query(query, [paymentId, paymentUrl, orderId])
}

const getOrderByIdForWebhook = async (orderId) => {
  const res = await db.query(`
    SELECT id, user_id, status
    FROM orders
    WHERE id = $1
  `, [orderId])

  return res.rows[0] || null
}

module.exports = {
    createOrder,
    getOrderById,
    getOrderByIdForPayment,
    updateOrderStatus,
    getPendingOrderByUser,
    cancelOrder,
    savePaymentInfo,
    getOrderByIdForWebhook
}