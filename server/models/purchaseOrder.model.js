import mongoose from "mongoose";
const purchaseOrder = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
        supplier: { 
          supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
          person_name: { type: String, required: true},
          person_number: { type: String,required: true},
          person_email: { type: String, required: false},
          company_name: { type: String, required: true},
          company_country: { type: String, required: true},
          company_province: { type: String, required: true},
          company_city: { type: String, required: true},
          company_zipCode: { type: String, required: true},
        },
        order_date: { type: Date, default: Date.now }, 
        order_status: { type: String, enum: ["Draft", "Approved", "Complete", "Archived"], required: true },
        archivedAt: { type: Date, default: null, index: { expires: '30d' } },
        items: [
          {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true }, 
            description: { type: String, required: true }, 
            quantity: { type: Number, required: true },
            backorder_quantity: { type: Number, required: true },  
            status: {type: String, enum: ["Pending", "Complete"], required: true}, 
          },
        ],
      },
      
    {
        timestamps: true,
    }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrder);

export default PurchaseOrder;
