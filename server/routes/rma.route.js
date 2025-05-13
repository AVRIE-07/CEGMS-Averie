import express from "express";
import {
    createRMA,
    getAllRMAs,
    getAllArchivedRMAs,
    updateRMA,
    archiveRMA,
    deleteRMA,
    getRMAReports
} from "../controllers/rma.controller.js";

const router = express.Router();

router.post("/", createRMA);
router.get("/", getAllRMAs);
router.put("/:id", updateRMA);
router.get("/archived", getAllArchivedRMAs);
router.put("/archive/:id", archiveRMA);
router.delete("/:id", deleteRMA);
router.get("/report", getRMAReports);

export default router;
