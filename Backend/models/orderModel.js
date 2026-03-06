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
    },

    paymentIntentId: {
      type: String,
      default: "",
    },

    // ✅ Numeric status for frontend
    status: {
      type: Number,
      enum: [0, 1, 2], // 0 = Pending, 1 = Processing, 2 = Delivered
      default: 0,
      index: true,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

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
 INDEX OPTIMIZATION
================================================
*/

OrderSchema.index({ userId: 1, paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

/*
================================================
 VIRTUAL FIELD FOR STATUS TEXT
================================================
*/
OrderSchema.virtual("statusText").get(function () {
  switch (this.status) {
    case 0:
      return "Pending";
    case 1:
      return "Processing";
    case 2:
      return "Delivered";
    default:
      return "Unknown";
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;