const express = require("express");
const SupplierModel = require("../models/Inventory/Supplier"); // Adjust model name to Supplier
const router = express.Router();

// GET all suppliers (Read)
router.get("/", async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new supplier (Create)
router.post("/", async (req, res) => {
  const { name } = req.body; // Adjust field name for supplier

  // Basic validation
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Supplier name is required" });
  }

  try {
    const newSupplier = new SupplierModel({ name });
    const savedSupplier = await newSupplier.save();
    res.status(201).json({ success: true, data: savedSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// PUT to update an existing supplier (Update)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Supplier name is required" });
  }

  try {
    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      id,
      { name }, // Adjust field for supplier
      { new: true } // Returns the updated document
    );

    if (!updatedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE a supplier (Delete)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSupplier = await SupplierModel.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
