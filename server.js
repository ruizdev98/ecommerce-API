require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products");
const brandsRoutes = require("./routes/brands");
const departmentsRoutes = require("./routes/departments");
const categoriesRoutes = require("./routes/categories");
const gendersRoutes = require("./routes/genders");
const blogsRoutes = require("./routes/blogs");
const departmentCategoriesRoutes = require("./routes/departmentCategories");
const cartRoutes = require("./routes/cart");
const colorsRoutes = require("./routes/colors");
const sizesRoutes = require("./routes/sizes");
const productVariantsRoutes = require("./routes/productVariants");
const ubigeoRoutes = require("./routes/ubigeo");
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const paymentsRoutes = require('./routes/payments')

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/genders", gendersRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/department-categories", departmentCategoriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/colors", colorsRoutes);
app.use("/api/sizes", sizesRoutes);
app.use("/api/product-variants", productVariantsRoutes);
app.use("/api/ubigeo", ubigeoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});