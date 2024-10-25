const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/CenteredTable/Category");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
});

// POST a new category
router.post("/", async (req, res) => {
  const { product_Category } = req.body;

  // Ensure category name is provided
  if (!product_Category) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const newCategory = new CategoryModel({ product_Category });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error while creating category:", error); // Log the full error
    // Handle duplicate category error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to create category", error });
    }
  }
});

// PUT (update) a category by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { product_Category } = req.body;

  // Ensure category name is provided
  if (!product_Category) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { product_Category },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
});

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
});

module.exports = router;
