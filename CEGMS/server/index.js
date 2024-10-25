// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes"); // Import your product routes
const categoryRoutes = require("./routes/categoryRoutes");
const manualAdjustmentRoutes = require("./routes/manualAdjustmentRoutes");
const stockMovement = require("./routes/stockMovement");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/inventory-system")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/users", userRoutes); // Prefix for user routes
app.use("/api/products", productRoutes); // Prefix for product routes
app.use("/api/category", categoryRoutes); // Prefix for product routes
app.use("/api/manualAdjustment", manualAdjustmentRoutes); // Prefix for product routes
app.use("/api/stockMovement", stockMovement); // Prefix for product routes

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
