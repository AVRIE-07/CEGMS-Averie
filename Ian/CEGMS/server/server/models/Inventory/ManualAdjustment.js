// models/ManualAdjustmentModel.js

const mongoose = require("mongoose");

// Define the schema for productDetails
const ManualAdjustmentSchema = new mongoose.Schema(
  {
    product_ID: {
      type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
      ref: "Category", // Reference to the Category collection
      required: true,
    },
    adj_Description: { type: String, required: true },
    adj_Category: { type: String, required: true },
    adj_Quantity: { type: Number, required: true },
    adj_Price: { type: Number, required: true },
    adj_Adjustment_Type: { type: String, required: true },
  },
  {
    collection: "manualAdjustment", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const ManualAdjustmentModel = mongoose.model(
  "ManualAdjustment",
  ManualAdjustmentSchema
);

// Export the model for use in other files
module.exports = ManualAdjustmentModel;
