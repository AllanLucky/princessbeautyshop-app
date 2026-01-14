import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Customer snapshot at invoice creation
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
  },

  invoiceNumber: { type: String, required: true, unique: true },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],

  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalPaid: { type: Number, required: true },
  paymentMethod: { type: String, default: "Stripe" },
  profit: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  createdAt: { type: Date, default: Date.now },
});

// Prevent OverwriteModelError
const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
