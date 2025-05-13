import BackOrder from "../models/backOrder.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";

export const createBackOrder = async (req, res) => {
  try {
    const { user_id, supplier_id, po_id, order_status, items } = req.body;

    const newBackOrder = new BackOrder({
      user_id,
      supplier_id,
      po_id,
      order_status,
      items,
    });

    await newBackOrder.save();
    res.status(201).json(newBackOrder);
  } catch (error) {
    console.error("Error creating backorder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBackOrders = async (req, res) => {
  try {
    const backorders = await BackOrder.find({ order_status: { $ne: "Archived" } })
      .populate("user_id", "first_name last_name") 
      .populate("supplier_id", "company_name company_email")
      .populate("po_id")
      .populate({
        path: "items.product_id",
        select: "product_Name product_Description product_Price product_Category product_Current_Stock"
      });        
    res.status(200).json(backorders);
  } catch (error) {
    console.error("Error fetching Backorders:", error);
    res.status(500).json({ message: "Failed to fetch Backorders", error: error.message });
  }
};

export const getAllArchivedBackOrders = async (req, res) => {
  try {
    const backorders = await BackOrder.find({ order_status: { $eq: "Archived" } })
      .populate("user_id", "first_name last_name") 
      .populate("supplier_id", "company_name company_email")
      .populate("po_id", "items")
      .populate({
        path: "items.product_id",
        select: "product_Name product_Description product_Price product_Category product_Current_Stock"
      });        
    res.status(200).json(backorders);
  } catch (error) {
    console.error("Error fetching Backorders:", error);
    res.status(500).json({ message: "Failed to fetch Backorders", error: error.message });
  }
};

export const updateBackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBackorder = await BackOrder.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBackorder) {
      return res.status(404).json({ message: "GRN not found" });
    }

    res.status(200).json(updatedBackorder);
  } catch (error) {
    console.error("Error updating GRN:", error);
    res.status(500).json({ message: "Failed to update GRN", error: error.message });
  }
};

export const archiveBackOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBackorder = await BackOrder.findByIdAndUpdate(
      id,
      {
        order_status: "Archived",
        archivedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedBackorder) {
      return res.status(404).json({ message: "Backorder not found" });
    }

    res.status(200).json({ message: "Backorder archived successfully" });
  } catch (error) {
    console.error("Error archiving Backorder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBackOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBackorder = await BackOrder.findByIdAndDelete(id);

    if (!deletedBackorder) {
      return res.status(404).json({ message: "Backorder not found" });
    }

    res.status(200).json({ message: "Backorder deleted successfully" });
  } catch (error) {
    console.error("Error deleting Backorder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBackOrderReports = async (req, res) => {
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

    const reports = await BackOrder.find(filter)
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


