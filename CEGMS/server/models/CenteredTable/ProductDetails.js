const mongoose = require("mongoose");

// Define the schema for productDetails
const ProductDetailsSchema = new mongoose.Schema(
  {
    product_Id: { type: String, unique: true }, // Custom Product ID
    product_Category: { type: String, required: true },
    product_Description: { type: String, required: true },
    product_Current_Stock: { type: Number, required: true },
    product_Quantity: { type: Number, required: true },
    product_Price: { type: Number, required: true },
    product_Minimum_Stock_Level: { type: Number, required: true },
    product_Maximum_Stock_Level: { type: Number, required: true },
  },
  {
    collection: "productDetails", // Specify the collection name explicitly
  }
);

// Pre-save hook to generate custom product ID
ProductDetailsSchema.pre("save", async function (next) {
  const product = this;

  // Generate a random 4-digit number
  function generateRandomId() {
    return Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  }

  // Generate custom ID in the format "PRDCTxxxx"
  if (!product.product_Id) {
    let unique = false;
    let newProductId;

    // Loop to ensure the product_Id is unique
    while (!unique) {
      newProductId = `PRDCT${generateRandomId()}`;
      const existingProduct = await mongoose.models.ProductDetails.findOne({
        product_Id: newProductId,
      });
      if (!existingProduct) {
        unique = true;
      }
    }

    product.product_Id = newProductId;
  }

  next();
});

// Create the model based on the schema
const ProductDetailsModel = mongoose.model(
  "ProductDetails",
  ProductDetailsSchema
);

// Export the model for use in other files
module.exports = ProductDetailsModel;
