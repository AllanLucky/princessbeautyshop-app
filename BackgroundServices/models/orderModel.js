// src/models/orderModel.js

import mongoose from "mongoose";

/*
========================================================
ORDER WORKFLOW MODEL (ENTERPRISE READY ⭐)
Pipeline:
Pending → Confirmed → Processing → Shipped → Delivered → Cancelled
========================================================
*/

const OrderSchema = new mongoose.Schema(
  {
    /*
    =====================================================
    CUSTOMER INFORMATION
    =====================================================
    */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    /*
    =====================================================
    ORDER PRODUCTS
    =====================================================
    */

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

    /*
    =====================================================
    PAYMENT
    =====================================================
    */

    total: {
      type: Number,
      required: true,
      min: 0,
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

    paidAt: Date,
    refundedAt: Date,

    /*
    =====================================================
    ORDER STATUS WORKFLOW
    =====================================================
    */

    /*
    Mapping:

    0 → Pending
    1 → Confirmed
    2 → Processing
    3 → Shipped
    4 → Delivered
    5 → Cancelled
    */

    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    /*
    =====================================================
    ⭐ ENTERPRISE TRACKING FIELDS
    =====================================================
    */

    estimatedDeliveryDate: Date,

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastStatusUpdatedAt: Date,

    /*
    =====================================================
    EMAIL WORKER FLAGS (IMPORTANT ⭐)
    Default = false prevents background worker skipping
    =====================================================
    */

    pendingEmailSent: {
      type: Boolean,
      default: false,
    },

    confirmedEmailSent: {
      type: Boolean,
      default: false,
    },

    processingEmailSent: {
      type: Boolean,
      default: false,
    },

    shippedEmailSent: {
      type: Boolean,
      default: false,
    },

    deliveredEmailSent: {
      type: Boolean,
      default: false,
    },

    cancelledEmailSent: {
      type: Boolean,
      default: false,
    },

    /*
    =====================================================
    ORDER TIMELINE HISTORY
    =====================================================
    */

    statusHistory: [
      {
        status: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

/*
====================================================
INDEX OPTIMIZATION
====================================================
*/

OrderSchema.index({ userId: 1, paymentStatus: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

/*
====================================================
VIRTUAL DISPLAY FIELD
====================================================
*/

OrderSchema.virtual("statusText").get(function () {
  const map = {
    0: "Pending",
    1: "Confirmed",
    2: "Processing",
    3: "Shipped",
    4: "Delivered",
    5: "Cancelled",
  };

  return map[this.status] || "Unknown";
});

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;