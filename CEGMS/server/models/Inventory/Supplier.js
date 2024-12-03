// models/SupplierModel.js

const mongoose = require("mongoose");

// Define the schema for supplier
const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Supplier name
  },
  {
    collection: "suppliers", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const SupplierModel = mongoose.model("Supplier", SupplierSchema);

// Export the model for use in other files
module.exports = SupplierModel;
