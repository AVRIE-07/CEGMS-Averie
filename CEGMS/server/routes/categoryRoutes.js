const express = require("express");
const CategoryModel = require("../models/CenteredTable/Category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const category = await CategoryModel.find();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new category
router.post("/", async (req, res) => {
  const { product_Category } = req.body; // Expecting product_Category in the request body

  // Basic validation
  if (!product_Category) {
    return res
      .status(400)
      .json({ success: false, message: "Product category is required" });
  }

  try {
    // Create a new category
    const newCategory = new CategoryModel({
      product_Category, // Set the field based on your schema
    });

    // Save to the database
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, data: savedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
module.exports = router;
