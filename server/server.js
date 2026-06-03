// if (process.env.NODE_ENV !== "production") {
// }
require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const helmet = require("helmet");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const userRoutes = require("./routes/userRoutes");
const salesRoutes = require("./routes/salesRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productExchangeRoutes = require("./routes/productExchangeRoutes");
const purchaseReturnRoutes = require("./routes/purchaseReturnRoutes");
const salesReturnRoutes = require("./routes/salesReturnRoutes");
const CompanyProductReturnRoutes = require("./routes/companyProductReturnRoutes");
const CompanySalesReturnRoutes = require("./routes/companySalesReturnRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const scrapProductRoutes = require("./routes/scrapProductRoutes");
const scrapProductSellRoutes = require("./routes/scrapProductSellRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ellitebattery.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//   })
// );
// app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const port = process.env.PORT || 4000;

// Connect
connectDB();

// Api Routes
// app.get("/", (req, res) => {
//     res.send("Server is working!");
// });
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/supplier", supplierRoutes); 
app.use("/api/product-exchange", productExchangeRoutes); 
app.use("/api/purchase-return", purchaseReturnRoutes); 
app.use("/api/sales-return", salesReturnRoutes); 
app.use("/api/company-product-return", CompanyProductReturnRoutes);
app.use("/api/company-sales-return", CompanySalesReturnRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/scrap-product", scrapProductRoutes);
app.use("/api/scrap-product-sell", scrapProductSellRoutes);

app.listen(port, () => {
  console.log(`LISTENING TO THE PORT ${port}`);
});
