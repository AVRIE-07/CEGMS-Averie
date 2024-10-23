// models/CategoryModel.js

const mongoose = require("mongoose");

// Define the schema for category
const CategorySchema = new mongoose.Schema(
  {
    product_Category: { type: String, required: true }, // Product Category
  },
  {
    collection: "category", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const CategoryModel = mongoose.model("Category", CategorySchema);

// Export the model for use in other files
module.exports = CategoryModel;
