import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalPaid: { type: Number, required: true },
  paymentMethod: { type: String, default: "Stripe" },
  profit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Fix OverwriteModelError:
const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export default Invoice;

