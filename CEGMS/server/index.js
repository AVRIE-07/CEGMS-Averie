const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const loginRoute = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes"); // Import your product routes
const categoryRoutes = require("./routes/categoryRoutes");
const manualAdjustmentRoutes = require("./routes/manualAdjustmentRoutes");
const stockMovement = require("./routes/stockMovement");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/inventory-system")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes
app.use("/api/users", loginRoute); // All routes in loginRoute.js will be prefixed with "/api"
app.use("/api/category", categoryRoutes); // Prefix for category routes
app.use("/api/products", productRoutes); // Prefix for product routes
app.use("/api/category", categoryRoutes); // Prefix for category routes
app.use("/api/manualAdjustment", manualAdjustmentRoutes); // Prefix for manual adjustment routes
app.use("/api/stockMovement", stockMovement); // Prefix for stock movement routes
app.use("/api/report", reportRoutes); // Prefix for report routes (fixed)
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
