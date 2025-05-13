import express from "express";
import {
  createSupplier,
  fetchSupplier,
  fetchAllSuppliers,
  updateSupplier,
  deleteSupplier
} from "../controllers/supplier.controller.js";

const router = express.Router();

router.post("/", createSupplier);
router.get("/", fetchAllSuppliers);
router.get('/:id', fetchSupplier);
router.put('/:id', updateSupplier);
router.delete("/:id", deleteSupplier);


export default router;
