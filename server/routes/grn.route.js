import express from "express";
import {
    createGRN,
    getAllGRNs,
    getAllArchivedGRNs,
    updateGRN,
    archiveGRN,
    deleteGRN,
    getGRNReports
} from "../controllers/grn.controller.js";

const router = express.Router();

router.post("/", createGRN);
router.get("/", getAllGRNs);
router.get("/archived", getAllArchivedGRNs);
router.put("/:id", updateGRN);
router.put("/archive/:id", archiveGRN);
router.delete("/:id", deleteGRN);
router.get("/report", getGRNReports);

export default router;
