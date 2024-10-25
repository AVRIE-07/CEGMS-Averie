const express = require("express");
const ManualAdjustmentModel = require("../models/Inventory/ManualAdjustment");
const router = express.Router();

// Route to create a manual adjustment entry
router.post("/", async (req, res) => {
  try {
    const manualAdjustment = new ManualAdjustmentModel(req.body);
    const savedAdjustment = await manualAdjustment.save();
    res.status(201).json(savedAdjustment);
  } catch (error) {
    console.error("Error creating manual adjustment:", error); // Log full error
    res
      .status(500)
      .json({ message: "Error creating manual adjustment.", error });
  }
});

module.exports = router;
