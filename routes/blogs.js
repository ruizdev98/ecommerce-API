// routes/blogs.js
const express = require("express");
const router = express.Router();
const blogsController = require("../controllers/blogsController");

// Obtener todas las categorías
router.get("/", blogsController.getAllBlogs);

module.exports = router;