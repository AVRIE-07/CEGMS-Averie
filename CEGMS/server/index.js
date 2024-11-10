const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes"); // Import your product routes
const categoryRoutes = require("./routes/categoryRoutes");
const manualAdjustmentRoutes = require("./routes/manualAdjustmentRoutes");
const stockMovement = require("./routes/stockMovement");
const reportRoutes = require("./routes/reportRoutes");
const sessionStore = require("./session"); // Assuming session.js is in the same directory
const session = require("express-session"); // Add this line

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to `true` in production with HTTPS
  })
);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/inventory-system");
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1); // Exit the process with an error code if connection fails
  }
};

// Connect to MongoDB
connectDB();

// Define API routes
app.use("/users", userRoutes); // Prefix for user routes
app.use("/api/products", productRoutes); // Prefix for product routes
app.use("/api/category", categoryRoutes); // Prefix for category routes
app.use("/api/manualAdjustment", manualAdjustmentRoutes); // Prefix for manual adjustment routes
app.use("/api/stockMovement", stockMovement); // Prefix for stock movement routes
app.use("/api/report", reportRoutes); // Prefix for report routes (fixed)

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
