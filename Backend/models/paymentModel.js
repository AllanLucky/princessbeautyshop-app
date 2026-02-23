import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
      index: true,
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
      index: true,
    },

    payment_provider: {
      type: String,
      default: "pesapal",
      index: true,
    },

    order_id: {
      type: String,
      sparse: true,
      index: true,
    },

    payment_reference: {
      type: String,
      sparse: true,
      index: true,
    },

    redirect_url: String,

    error_response: mongoose.Schema.Types.Mixed,

    error_status: Number,

    status: {
      type: String,
      enum: ["initiated", "completed", "failed", "cancelled", "pending"],
      default: "initiated",
      index: true,
    },

    payment_status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
      index: true,
    },

    status_details: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ reference: 1 }, { unique: true });
PaymentSchema.index({ orderId: 1, payment_status: 1 });

/*
==============================
TIMESTAMP FIX
==============================
*/

PaymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;