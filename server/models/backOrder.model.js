import mongoose from "mongoose";
const backOrder = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    po_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
    },
    order_date: { type: Date, default: Date.now },
    order_status: {
      type: String,
      enum: ["Draft", "Approved", "Archived"],
      required: true,
    },
    archivedAt: { type: Date, default: null, index: { expires: "30d" } },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        backorder_quantity: { type: Number, required: true },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const BackOrder = mongoose.model("BackOrder", backOrder);

export default BackOrder;
