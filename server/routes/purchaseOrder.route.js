import express from "express";
import {
  getLowStockGroupedBySupplier,
  createPurchaseOrder,
  getAllPurchaseOrders,
  getAllArchivedPurchaseOrders,
  updatePurchaseOrder,
  archivePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderReports
} from "../controllers/purchaseOrder.controller.js";

const router = express.Router();

router.get("/low-stock", getLowStockGroupedBySupplier);
router.post("/", createPurchaseOrder);
router.get("/", getAllPurchaseOrders);
router.get("/archived", getAllArchivedPurchaseOrders);
router.put("/:id", updatePurchaseOrder);
router.put("/archive/:id", archivePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);
router.get("/report", getPurchaseOrderReports);


export default router;
