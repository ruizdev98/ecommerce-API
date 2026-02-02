const Cart = require("../models/Cart");

// Obtener carrito del usuario
async function getCart(req, res) {
  try {
    const { userId } = req.query;

    // Validación básica
    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    const result = await Cart.getUserCart(userId);

    return res.status(200).json({
      success: true,
      cart: result,
    });
  } catch (err) {
    console.error("❌ Error en getCart:", err);
    return res.status(500).json({ error: "Error obteniendo carrito" });
  }
}

// Reemplazar los items del carrito
async function updateCart(req, res) {
  try {
    const { userId, items } = req.body;

    // Validación básica
    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items debe ser un array" });
    }

    const result = await Cart.replaceCartItems(userId, items);

    return res.status(200).json({
      success: true,
      message: "Carrito actualizado correctamente",
      cart: result,
    });
  } catch (err) {
    console.error("❌ Error en updateCart:", err);
    return res.status(500).json({
      error: "Error actualizando carrito",
      detail: err.message,    // 👈 MOSTRAR MENSAJE REAL
      stack: err.stack        // 👈 OPCIONAL (para debug)
    });
  }
}

module.exports = {
  getCart,
  updateCart,
};