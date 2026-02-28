import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["MPESA", "Stripe", "Flutterwave", "Paystack", "Cash"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED"],
      default: "PAID",
    },

    pdfUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==========================================
INDEX OPTIMIZATION ⭐
==========================================
*/

// Unique invoice number already creates index automatically

const Invoice =
  mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);

export default Invoice;