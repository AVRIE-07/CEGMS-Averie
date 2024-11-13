// models/ManualAdjustmentModel.js

const mongoose = require("mongoose");

// Define the schema for Manual Adjustment
const ManualAdjustmentSchema = new mongoose.Schema(
  {
    manualAdjust_ID: {
      type: String,
      unique: true, // Ensure each ID is unique
    },
    product_ID: {
      type: String,
      required: true,
    },
    adj_Description: {
      type: String,
      required: true,
    },
    adj_Category: {
      type: String,
      required: true,
    },
    adj_Quantity: {
      type: Number,
      required: true,
    },
    adj_Price: {
      type: Number,
      required: true,
    },
    adj_Adjustment_Type: {
      type: String,
      required: true,
    },
    adj_Date: {
      type: Date, // Change to Date type
      default: Date.now, // Automatically set to current date
    },
  },
  {
    collection: "manualAdjustment", // Explicitly specify collection name
  }
);

// Create the model based on the schema
const ManualAdjustmentModel = mongoose.model(
  "ManualAdjustment",
  ManualAdjustmentSchema
);

module.exports = ManualAdjustmentModel;
