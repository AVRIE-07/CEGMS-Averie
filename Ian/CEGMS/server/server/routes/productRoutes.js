const express = require("express");
const ProductDetailsModel = require("../models/CenteredTable/ProductDetails");
const router = express.Router();

// Route to get all products
router.get("/", async (req, res) => {
  try {
    const products = await ProductDetailsModel.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to add a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new ProductDetailsModel(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // Send back the saved product
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await ProductDetailsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // This will apply validation on the updated fields
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await ProductDetailsModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
