// models/InventoryReportsModal.js

const mongoose = require("mongoose");

// Define the schema for productDetails
const InventoryReportsSchema = new mongoose.Schema(
  {
    user_ID: {
      type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
      ref: "Users", // Reference to the Category collection
      required: true,
    },
    manualAdjust_ID: {
      type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
      ref: "ManualAdjustment", // Reference to the Category collection
      required: true,
    },
    stockMovement_ID: {
      type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
      ref: "StockMovement", // Reference to the Category collection
      required: true,
    },
    report_Type: { type: String, required: true },
    report_Date_Generated: { type: String, required: true },

    start_Date: { type: String, required: true },
    end_Date: { type: String, required: true },
    summary: { type: String, required: true },
  },
  {
    collection: "inventoryReports", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const InventoryReportsModal = mongoose.model(
  "InventoryReports",
  InventoryReportsSchema
);

// Export the model for use in other files
module.exports = InventoryReportsModal;
