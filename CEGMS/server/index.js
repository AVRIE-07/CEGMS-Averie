// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Adjust the path as necessary

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

// Use user routes with a prefix
app.use("/users", userRoutes); // Prefix for user routes

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
