import mongoose from "mongoose";
import Product from "../models/product.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";

export const getLowStockGroupedBySupplier = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          $expr: { $lt: ["$product_Current_Stock", "$product_Minimum_Stock_Level"] }
        }
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier_id",
          foreignField: "_id",
          as: "supplier"
        }
      },
      {
        $unwind: "$supplier"
      },
      {
        $group: {
          _id: "$supplier._id",
          name: { $first: "$supplier.company_name" }, 
          contact: {
            $first: {
              person_name: "$supplier.person_name",
              person_number: "$supplier.person_number",
              person_email: "$supplier.person_email"
            }
          }, 
          address: {
            $first: {
              country: "$supplier.company_country",
              province: "$supplier.company_province",
              city: "$supplier.company_city",
              zipCode: "$supplier.company_zipCode"
            }
          },
          total_low_stock: { $sum: 1 }, 
          low_stock_products: {
            $push: {
              product_id: "$_id",
              name: "$product_Name",
              description: "$product_Description",
              current_stock: "$product_Current_Stock",
              minimum_stock: "$product_Minimum_Stock_Level",
              price: "$product_Price",
              category: "$product_Category"
            }
          }
        }
      }
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createPurchaseOrder = async (req, res) => {
  try {
    const {
      user_id,
      supplier,
      items,
      order_status = "Draft",
    } = req.body;

    if (!user_id || !supplier || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newPO = new PurchaseOrder({
      user_id,
      supplier,
      order_status,
      items,
    });

    const savedPO = await newPO.save();

    return res.status(201).json({
      message: "Purchase Order created successfully.",
      purchaseOrder: savedPO,
    });
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return res.status(500).json({ message: "Server error while creating purchase order." });
  }
};

export const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find({ order_status: { $ne: "Archived" } })
      .populate("user_id", "name email")
      .populate("supplier.supplier_id", "company_email")
      .populate("items.product_id")
      .sort({ createdAt: -1 });

    res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ message: "Failed to retrieve purchase orders" });
  }
};

export const getAllArchivedPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find({ order_status: { $eq: "Archived" } })
      .populate("user_id", "name email")
      .populate("supplier.supplier_id", "company_email")
      .populate("items.product_id")
      .sort({ createdAt: -1 });

    res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ message: "Failed to retrieve purchase orders" });
  }
};


export const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, items } = req.body;

    const updatedPO = await PurchaseOrder.findByIdAndUpdate(
      id,
      { order_status, items },
      { new: true }
    );

    if (!updatedPO) return res.status(404).json({ message: "PO not found" });

    res.status(200).json(updatedPO);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

export const archivePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPO = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        order_status: "Archived",
        archivedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedPO) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    res.status(200).json({ message: "Purchase Order archived successfully", purchaseOrder: updatedPO });
  } catch (error) {
    console.error("Error archiving purchase order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPO = await PurchaseOrder.findByIdAndDelete(id);

    if (!deletedPO) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    res.status(200).json({ message: "Purchase Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPurchaseOrderReports = async (req, res) => {
  try {
    const { supplier, user, startDate, endDate, status } = req.query;

    const filter = {};

    if (supplier && mongoose.Types.ObjectId.isValid(supplier)) {
      filter["supplier.supplier_id"] = supplier;
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

    const reports = await PurchaseOrder.find(filter)
      .populate("supplier.supplier_id")
      .populate("user_id")
      .sort({ createdAt: -1 });
    console.log("ito na fetch", filter);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching purchase order reports:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

