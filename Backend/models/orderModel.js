// src/models/orderModel.js

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        desc: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        img: {
          type: String,
          default: "",
        },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    currency: {
      type: String,
      default: "KES",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    declineReason: {
      type: String,
      default: "",
    },

    stripeSessionId: {
      type: String,
      sparse: true,
      unique: true,
      // ❗ Do NOT add index: true here (prevents duplicate warning)
    },

    paymentIntentId: {
      type: String,
      default: "",
    },

    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
      index: true,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    // ⚡ NEW: track if delivered email has already been sent
    deliveredEmailSent: {
      type: Boolean,
      default: false,
      index: true,
    },

    paidAt: Date,

    refundedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
================================================
 INDEX OPTIMIZATION (NO DUPLICATE INDEX WARNING)
================================================
*/

// Only safe composite indexes
OrderSchema.index({ userId: 1, paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;