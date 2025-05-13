import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import supplierRoutes from "./routes/supplier.route.js";
import purchaseOrderRoutes from "./routes/purchaseOrder.route.js";
import grnRoutes from "./routes/grn.route.js";
import rmaRoutes from "./routes/rma.route.js";
import backorderRoutes from "./routes/backorder.route.js";
import productRoutes from "./routes/product.route.js";

import cors from "cors";
import cookieParser from "cookie-parser";

// STORAGEf
import storageProductRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import storageSupplierRoutes from "./routes/storageSupplier.route.js";
import manualAdjustmentRoutes from "./routes/manualAdjustmentRoutes.js";
import stockMovement from "./routes/stockMovement.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/grns", grnRoutes);
app.use("/api/rmas", rmaRoutes);
app.use("/api/backorders", backorderRoutes);

//Storage
app.use("/api/storageProducts", storageProductRoutes); // Prefix for product routes
app.use("/api/category", categoryRoutes); // Prefix for category routes

app.use("/api/storageSupplier", storageSupplierRoutes);
app.use("/api/manualAdjustment", manualAdjustmentRoutes); // Prefix for manual adjustment routes
app.use("/api/stockMovement", stockMovement); // Prefix for stock movement routes

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
