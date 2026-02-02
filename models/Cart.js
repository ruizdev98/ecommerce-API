  const pool = require("../db");
  const { keysToCamelCase } = require("../utils/camelCase");

  // 🔵 Función auxiliar: obtener o crear carrito
  async function findOrCreateCart(client, userId) {
    let res = await client.query(
      `SELECT * FROM carts WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (res.rows.length > 0) return res.rows[0];

    res = await client.query(
      `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
      [userId]
    );

    return res.rows[0];
  }

  // 🟦 Obtener carrito con productos
  async function getUserCart(userId) {
    const client = await pool.connect();

    try {
      const cart = await findOrCreateCart(client, userId);

      const itemsRes = await client.query(
        `
        SELECT
          ci.id,
          ci.quantity,
          ci.variant_id,
          p.id AS product_id,
          p.name,
          p.price,
          p.discount_price,
          p.image,
          p.promo_note,
          b.name AS brand_name,
          c.name AS color,
          s.name AS size,
          pv.sku
        FROM cart_items ci
        INNER JOIN product_variants pv ON pv.id = ci.variant_id
        INNER JOIN products p ON p.id = pv.product_id
        INNER JOIN brands b ON b.id = p.brand_id
        INNER JOIN colors c ON c.id = pv.color_id
        INNER JOIN sizes s ON s.id = pv.size_id
        WHERE ci.cart_id = $1
        `,
        [cart.id]
      );

      return {
        cartId: cart.id,
        items: keysToCamelCase(itemsRes.rows),
      };
    } catch (err) {
      console.error("❌ Error en getUserCart:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // 🟧 Reemplazar items del carrito
  async function replaceCartItems(userId, items = []) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Obtener/crear carrito
      const cart = await findOrCreateCart(client, userId);

      // 2. Normalizar items (evitar duplicados)
      // <-- Aquí es donde va el bloque que mencionaste
      // 2️⃣ Normalizar items: combinar duplicados y sumar cantidades
      const normalized = {};
      for (const item of items) {
        if (!normalized[item.variantId]) {
          normalized[item.variantId] = { variantId: item.variantId, quantity: 0 };
        }
        normalized[item.variantId].quantity += item.quantity;
      }


      // 3. Eliminar items anteriores
      await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

      // 4. Insertar nuevos items
      for (const entry of Object.values(normalized)) {
        await client.query(
          `
          INSERT INTO cart_items (cart_id, variant_id, quantity)
          VALUES ($1, $2, $3)
          ON CONFLICT (cart_id, variant_id)
          DO UPDATE SET quantity = EXCLUDED.quantity;
          `,
          [cart.id, entry.variantId, entry.quantity]
        );
      }

      await client.query("COMMIT");
      return { success: true };
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ Error en replaceCartItems:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  module.exports = {
    getUserCart,
    replaceCartItems,
  };