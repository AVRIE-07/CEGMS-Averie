import mongoose from "mongoose";
const rma = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
        supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true }, 
        po_id: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
        grn_id: { type: mongoose.Schema.Types.ObjectId, ref: "GRN", required: true },
        return_date: { type: Date, default: Date.now },
        return_status: { type: String, enum: ["Draft", "Approved", "Archived"], required: true }, 
        archivedAt: { type: Date, default: null, index: { expires: '30d' } },
        items: [
            {
                product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
                return_quantity: { type: Number, required: true },
                reason: { type: String,  default: null}, 
            },
        ],
    },
    
    {
        timestamps: true,
    }
);

const RMA = mongoose.model("RMA", rma);

export default RMA;
