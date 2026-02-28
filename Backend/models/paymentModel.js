import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    payment_provider: {
      type: String,
      default: "pesapal",
    },

    order_id: {
      type: String,
      sparse: true,
    },

    payment_reference: {
      type: String,
      sparse: true,
    },

    redirect_url: String,

    error_response: mongoose.Schema.Types.Mixed,

    error_status: Number,

    status: {
      type: String,
      enum: ["initiated", "completed", "failed", "cancelled", "pending"],
      default: "initiated",
    },

    payment_status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },

    status_details: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

// Keep only compound indexes

PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ orderId: 1, payment_status: 1 });

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;