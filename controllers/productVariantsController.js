const ProductVariant = require("../models/ProductVariant");

async function getVariantsByProduct(req, res) {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.findByProductId(productId);
    res.json(variants);
  } catch (error) {
    console.error("Error al obtener variantes:", error);
    res.status(500).json({ error: "Error al obtener variantes de producto" });
  }
}

async function getAvailableColorsByProduct(req, res) {
  try {
    const { productId } = req.params;
    const colors = await ProductVariant.findAvailableColorsByProductId(productId);
    res.json(colors);
  } catch (error) {
    console.error("Error al obtener colores:", error);
    res.status(500).json({ error: "Error al obtener colores del producto" });
  }
}

async function getAvailableSizesByProduct(req, res) {
  try {
    const { productId } = req.params;
    const sizes = await ProductVariant.findAvailableSizesByProductId(productId);
    res.json(sizes);
  } catch (error) {
    console.error("Error al obtener tallas:", error);
    res.status(500).json({ error: "Error al obtener tallas del producto" });
  }
}

async function getVariantById(req, res) {
  try {
    const { variantId } = req.params;
    const variant = await ProductVariant.findOne(variantId);
    if (!variant) {
      return res.status(404).json({ error: "Variante no encontrada" });
    }
    res.json(variant);
  } catch (error) {
    console.error("Error al obtener variante:", error);
    res.status(500).json({ error: "Error al obtener variante" });
  }
}

module.exports = {
  getVariantsByProduct,
  getAvailableColorsByProduct,
  getAvailableSizesByProduct,
  getVariantById,
};