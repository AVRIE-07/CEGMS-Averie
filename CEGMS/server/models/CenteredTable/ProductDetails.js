// models/ProductDetailsModel.js

const mongoose = require("mongoose");

// Define the schema for productDetails
const ProductDetailsSchema = new mongoose.Schema(
  {
    product_Category: { type: String, required: true },
    product_Description: { type: String, required: true },
    product_Quantity: { type: Number, required: true },
    product_Price: { type: Number, required: true },
    product_Cost: { type: Number, required: true },
    product_Minimum_Stock_Level: { type: Number, required: true },
    product_Maximum_Stock_Level: { type: Number, required: true },
  },
  {
    collection: "productDetails", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const ProductDetailsModel = mongoose.model(
  "ProductDetails",
  ProductDetailsSchema
);

// Export the model for use in other files
module.exports = ProductDetailsModel;
