const express = require("express");
const StockMovementModel = require("../models/Inventory/StockMovement");
const ManualAdjustmentModel = require("../models/Inventory/ManualAdjustment");
const router = express.Router();

// Route to get all products
router.get("/", async (req, res) => {
  try {
    const products = await StockMovementModel.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to create a manual adjustment and linked stock movement entry
router.post("/", async (req, res) => {
  try {
    // Step 1: Create a new manual adjustment entry
    const manualAdjustment = new ManualAdjustmentModel(req.body);
    const savedManualAdjustment = await manualAdjustment.save();

    // Step 2: Create a stock movement entry with movement_ID set to manualAdjust_ID
    const stockMovementData = {
      ...req.body,
      movement_ID: savedManualAdjustment.manualAdjust_ID, // Set movement_ID in StockMovement
    };
    const stockMovement = new StockMovementModel(stockMovementData);
    const savedStockMovement = await stockMovement.save();

    res.status(201).json({
      manualAdjustment: savedManualAdjustment,
      stockMovement: savedStockMovement,
    });
  } catch (error) {
    console.error(
      "Error creating linked manual adjustment and stock movement:",
      error
    ); // Log the full error
    res.status(500).json({
      message: "Error creating linked manual adjustment and stock movement.",
      error,
    });
  }
});

module.exports = router;
