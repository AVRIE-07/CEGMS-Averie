// models/StockMovementModel.js

const mongoose = require("mongoose");

// Define the schema for productDetails
const StockMovementSchema = new mongoose.Schema(
  {
    manualAdjust_ID: {
      type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
      ref: "ManualAdjustment", // Reference to the Category collection
      required: true,
    },
    user_ID: {
      type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
      ref: "Users", // Reference to the Category collection
      required: true,
    },
    adj_Quantity: { type: Number, required: true },
    stock_Date: { type: String, required: true },
    adj_Adjustment_Type: { type: String, required: true },

    stock_Status: { type: String, required: true },
  },
  {
    collection: "stockMovement", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const StockMovementModel = mongoose.model("StockMovement", StockMovementSchema);

// Export the model for use in other files
module.exports = StockMovementModel;
