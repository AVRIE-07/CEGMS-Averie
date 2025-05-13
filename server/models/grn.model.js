import mongoose from "mongoose";
const grn = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
        supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true }, 
        po_id: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true }, 
        delivered_date: { type: Date, default: Date.now },
        mop: { type: String, required: true },
        order_status: { type: String, enum: ["Draft", "Approved", "Archived"], required: true }, 
        archivedAt: { type: Date, default: null, index: { expires: '30d' } },
    items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
            order_quantity: { type: Number, required: true },
            received_quantity: { type: Number, required: true },
            return_quantity: { type: Number, required: true },
        },
    ],
  },
  
  {
    timestamps: true,
  }
);

const GRN = mongoose.model("GRN", grn);

export default GRN;
