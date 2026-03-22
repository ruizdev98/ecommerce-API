const Cart = require("../models/Cart");

// Obtener carrito del usuario
async function getCart(req, res) {
  try {
    // 🔥 userId desde Firebase
    const userId = req.user.uid

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
    // 🔥 userId desde Firebase
    const userId = req.user.uid

    const { items } = req.body;

    // Validación
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items debe ser un array" });
    }

    await Cart.replaceCartItems(userId, items);

    // 🔥 devolver carrito actualizado
    const updatedCart = await Cart.getUserCart(userId);

    return res.status(200).json({
      success: true,
      message: "Carrito actualizado correctamente",
      cart: updatedCart,
    });
  } catch (err) {
    console.error("❌ Error en updateCart:", err);
    return res.status(500).json({
      error: "Error actualizando carrito",
      detail: err.message,
    });
  }
}

module.exports = {
  getCart,
  updateCart,
};