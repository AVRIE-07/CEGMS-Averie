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
  },
  {
    collection: "manualAdjustment", // Explicitly specify collection name
  }
);

// Middleware to generate unique manualAdjust_ID before saving
ManualAdjustmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    let uniqueId;
    let exists = true;

    // Generate ID and ensure uniqueness
    while (exists) {
      uniqueId = `MADJT${Math.floor(1000 + Math.random() * 9000)}`; // MADJT followed by random 4 digits
      exists = await mongoose.models.ManualAdjustment.findOne({
        manualAdjust_ID: uniqueId,
      });
    }

    this.manualAdjust_ID = uniqueId;
  }
  next();
});

// Create the model based on the schema
const ManualAdjustmentModel = mongoose.model(
  "ManualAdjustment",
  ManualAdjustmentSchema
);

module.exports = ManualAdjustmentModel;
