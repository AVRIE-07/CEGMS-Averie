import express from "express";
import {
    createBackOrder,
    getAllBackOrders,
    updateBackOrder,
    getAllArchivedBackOrders,
    archiveBackOrder,
    deleteBackOrder,
    getBackOrderReports
} from "../controllers/backorder.controller.js";

const router = express.Router();

router.post("/", createBackOrder);
router.get("/", getAllBackOrders);
router.put("/:id", updateBackOrder);
router.get("/archived", getAllArchivedBackOrders);
router.put("/archive/:id", archiveBackOrder);
router.delete("/:id", deleteBackOrder);
router.get("/report", getBackOrderReports);

export default router;
