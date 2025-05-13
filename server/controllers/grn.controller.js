import mongoose from "mongoose";
import Product from "../models/product.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import GRN from "../models/grn.model.js";

export const createGRN = async (req, res) => {
    try {
      const {
        user_id,
        supplier_id,
        po_id,
        delivered_date,
        mop,
        order_status,
        items,
      } = req.body;
  
      const poExists = await PurchaseOrder.findById(po_id);
      if (!poExists) {
        return res.status(404).json({ message: "Purchase Order not found" });
      }
  
      const newGRN = new GRN({
        user_id,
        supplier_id,
        po_id,
        delivered_date,
        mop,
        order_status,
        items,
      });
  
      const savedGRN = await newGRN.save();
      res.status(201).json(savedGRN);
    } catch (error) {
      console.error("Error creating GRN:", error);
      res.status(500).json({ message: "Failed to create GRN", error: error.message });
    }
  };

  export const getAllGRNs = async (req, res) => {
    try {
      const grns = await GRN.find({ order_status: { $ne: "Archived" } })
        .populate("user_id", "first_name last_name") 
        .populate("supplier_id", "company_name company_email")
        .populate("po_id")
        .populate({
          path: "items.product_id",
          select: "product_Name product_Description product_Price product_Category product_Current_Stock"
        });        
      res.status(200).json(grns);
    } catch (error) {
      console.error("Error fetching GRNs:", error);
      res.status(500).json({ message: "Failed to fetch GRNs", error: error.message });
    }
  };

  export const getAllArchivedGRNs = async (req, res) => {
    try {
      const grns = await GRN.find({ order_status: { $eq: "Archived" } })
        .populate("user_id", "first_name last_name") 
        .populate("supplier_id", "company_name company_email")
        .populate("po_id")
        .populate({
          path: "items.product_id",
          select: "product_Name product_Description product_Price product_Category product_Current_Stock"
        });        
      res.status(200).json(grns);
    } catch (error) {
      console.error("Error fetching GRNs:", error);
      res.status(500).json({ message: "Failed to fetch GRNs", error: error.message });
    }
  };

  export const updateGRN = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      const updatedGRN = await GRN.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedGRN) {
        return res.status(404).json({ message: "GRN not found" });
      }
  
      res.status(200).json(updatedGRN);
    } catch (error) {
      console.error("Error updating GRN:", error);
      res.status(500).json({ message: "Failed to update GRN", error: error.message });
    }
  };

  export const archiveGRN = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updatedGRN = await GRN.findByIdAndUpdate(
        id,
        {
          order_status: "Archived",
          archivedAt: new Date(),
        },
        { new: true }
      );
  
      if (!updatedGRN) {
        return res.status(404).json({ message: "GRN not found" });
      }
  
      res.status(200).json({ message: "GRN archived successfully" });
    } catch (error) {
      console.error("Error archiving GRN:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const deleteGRN = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedGRN = await GRN.findByIdAndDelete(id);
  
      if (!deletedGRN) {
        return res.status(404).json({ message: "GRN not found" });
      }
  
      res.status(200).json({ message: "GRN deleted successfully" });
    } catch (error) {
      console.error("Error deleting GRN:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getGRNReports = async (req, res) => {
    try {
      const { supplier, user, startDate, endDate, status } = req.query;
  
      const filter = {};
  
      if (supplier && mongoose.Types.ObjectId.isValid(supplier)) {
        filter.supplier_id = supplier;
      }
  
      if (user && mongoose.Types.ObjectId.isValid(user)) {
        filter.user_id = user;
      }
  
      if (status && status !== "All") {
        filter.order_status = status;
      }
  
      if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
  
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
  
        filter.order_date = {
          $gte: start, 
          $lte: end,   
        };
      }
  
      const reports = await GRN.find(filter)
        .populate("supplier_id")
        .populate("user_id")
        .sort({ createdAt: -1 });
      console.log("ito na fetch", filter);
      res.status(200).json(reports);
    } catch (error) {
      console.error("Error fetching purchase order reports:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  