const express = require("express");
const ManualAdjustmentModel = require("../models/Inventory/ManualAdjustment");
const router = express.Router();

// Helper function to generate a unique manualAdjust_ID
async function generateUniqueID() {
  let uniqueId;
  let exists = true;

  // Generate ID and ensure uniqueness
  while (exists) {
    uniqueId = `MI${Math.floor(1000 + Math.random() * 9000)}`; // MADJT followed by random 4 digits
    exists = await ManualAdjustmentModel.findOne({ manualAdjust_ID: uniqueId });
  }

  return uniqueId;
}

router.post("/", async (req, res) => {
  try {
    const manualAdjustments = await Promise.all(
      req.body.map(async (adjustment) => {
        if (!adjustment.manualAdjust_ID) {
          adjustment.manualAdjust_ID = await generateUniqueID();
        }
        return adjustment;
      })
    );

    const savedAdjustments = await ManualAdjustmentModel.insertMany(
      manualAdjustments
    );

    res.status(201).json(savedAdjustments);
  } catch (error) {
    console.error("Error creating manual adjustment:", error);
    res
      .status(500)
      .json({ message: "Error creating manual adjustment.", error });
  }
});

module.exports = router;
