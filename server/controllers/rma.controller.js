import RMA from "../models/rma.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import GRN from "../models/grn.model.js";
import Supplier from "../models/supplier.model.js";

export const createRMA = async (req, res) => {
  try {
    const {
      user_id,
      supplier_id,
      po_id,
      grn_id,
      return_date,
      return_status,
      items,
    } = req.body;

    const poExists = await PurchaseOrder.findById(po_id);
    if (!poExists) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    const grnExists = await GRN.findById(grn_id);
    if (!grnExists) {
      return res.status(404).json({ message: "GRN not found" });
    }

    const supplierExists = await Supplier.findById(supplier_id);
    if (!supplierExists) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const newRMA = new RMA({
      user_id,
      supplier_id,
      po_id,
      grn_id,
      return_date,
      return_status,
      items,
    });

    const savedRMA = await newRMA.save();
    res.status(201).json(savedRMA);
  } catch (error) {
    console.error("Error creating RMA:", error);
    res.status(500).json({ message: "Failed to create RMA", error: error.message });
  }
};

export const getAllRMAs = async (req, res) => {
  try {
    const rmas = await RMA.find({ return_status: { $ne: "Archived" } })
      .populate("user_id", "first_name last_name") 
      .populate("supplier_id", "company_name company_email")
      .populate("po_id")
      .populate("grn_id")
      .populate({
        path: "items.product_id",
        select: "product_Name product_Description product_Price product_Category product_Current_Stock"
      });        
    res.status(200).json(rmas);
  } catch (error) {
    
    console.error("Error fetching rmas:", error);
    res.status(500).json({ message: "Failed to fetch rmas", error: error.message });
  }
};

export const updateRMA = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRMA = await RMA.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRMA) {
      return res.status(404).json({ message: "RMA not found" });
    }

    res.status(200).json(updatedRMA);
  } catch (error) {
    console.error("Error updating RMA:", error);
    res.status(500).json({ message: "Failed to update RMA", error: error.message });
  }
};

export const getAllArchivedRMAs = async (req, res) => {
  try {
    const rmas = await RMA.find({ return_status: { $eq: "Archived" } })
      .populate("user_id", "first_name last_name") 
      .populate("supplier_id", "company_name company_email")
      .populate("po_id")
      .populate("grn_id")
      .populate({
        path: "items.product_id",
        select: "product_Name product_Description product_Price product_Category product_Current_Stock"
      });        
    res.status(200).json(rmas);
  } catch (error) {
    console.error("Error fetching rmas:", error);
    res.status(500).json({ message: "Failed to fetch rmas", error: error.message });
  }
};

export const archiveRMA = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRMA = await RMA.findByIdAndUpdate(
      id,
      {
        return_status: "Archived",
        archivedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedRMA) {
      return res.status(404).json({ message: "RMA not found" });
    }

    res.status(200).json({ message: "RMA archived successfully" });
  } catch (error) {
    console.error("Error archiving RMA:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRMA = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRMA = await RMA.findByIdAndDelete(id);

    if (!deletedRMA) {
      return res.status(404).json({ message: "RMA not found" });
    }

    res.status(200).json({ message: "RMA deleted successfully" });
  } catch (error) {
    console.error("Error deleting RMA:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRMAReports = async (req, res) => {
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

      filter.return_date = {
        $gte: start, 
        $lte: end,   
      };
    }

    const reports = await RMA.find(filter)
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
