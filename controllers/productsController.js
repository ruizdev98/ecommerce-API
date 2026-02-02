const Product = require("../models/Product");

async function getAllProducts(req, res) {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

async function getBestSellerProducts(req, res) {
  try {
    const products = await Product.findBestSellers();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
}

async function getFeaturedProducts(req, res) {
  try {
    const products = await Product.findFeatured();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res.status(500).json({ error: "Error al obtener productos destacados" });
  }
}

async function getOfferProducts(req, res) {
  try {
    const products = await Product.findOffers();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res.status(500).json({ error: "Error al obtener productos destacados" });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener producto" });
  }
}

module.exports = {
  getAllProducts,
  getBestSellerProducts,
  getFeaturedProducts,
  getOfferProducts,
  getProductById,
};