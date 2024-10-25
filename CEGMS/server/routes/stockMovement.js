const express = require("express");
const StockMovementModel = require("../models/Inventory/StockMovement");
const router = express.Router();

// Assuming you have a stockMovement model imported
router.post("/", async (req, res) => {
  try {
    const {
      product_ID,
      movement_Description,
      movement_Quantity,
      movement_Date,
      movement_Type,
    } = req.body;

    const newMovement = new StockMovementModel({
      product_ID,
      movement_Description,
      movement_Quantity,
      movement_Date,
      movement_Type,
    });

    await newMovement.save();
    res.status(201).json(newMovement);
  } catch (error) {
    res.status(500).json({ message: "Error creating stock movement entry" });
  }
});

module.exports = router;
