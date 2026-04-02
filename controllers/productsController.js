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

async function getProducts(req, res) {
  try {
    let { category, brand, minPrice, maxPrice, bestSeller, featured, offer, limit } = req.query

    // 🔥 convertir brand a array
    if (brand && !Array.isArray(brand)) {
      brand = [brand]
    }

    const products = await Product.findProducts({
      categoryId: category,
      brand,
      minPrice,
      maxPrice,
      bestSeller: bestSeller === "true",
      featured: featured === "true",
      offer: offer === "true",
      limit: limit ? parseInt(limit) : undefined
    })

    res.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).json({ error: "Error al obtener productos" })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProducts,
};