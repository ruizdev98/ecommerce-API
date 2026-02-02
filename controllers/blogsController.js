const Blog = require("../models/Blog");

async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.getAll();
    res.json(blogs);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
}

module.exports = {
  getAllBlogs,
};