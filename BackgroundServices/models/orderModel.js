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

    /*
    =====================================================
    PAYMENT
    =====================================================
    */

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
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

    declineReason: {
      type: String,
      default: "",
    },

    /*
    =====================================================
    ORDER STATUS
    =====================================================
    */

    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
      index: true,
    },

    /*
    STATUS MAP
    ----------
    0 → Pending
    1 → Confirmed
    2 → Processing
    3 → Shipped
    4 → Delivered
    5 → Cancelled
    */

    trackingNumber: {
      type: String,
      default: "",
    },

    isDelivered: {
      type: Boolean,
      default: false,
      index: true,
    },

    deliveredAt: Date,

    /*
    =====================================================
    EMAIL DELIVERY FLAGS (VERY IMPORTANT)
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
      index: true,
    },

    cancelledEmailSent: {
      type: Boolean,
      default: false,
    },

    /*
    =====================================================
    STATUS HISTORY AUDIT LOG
    =====================================================
    */

    statusHistory: [
      {
        status: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: String,
          default: "system",
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],

    /*
    =====================================================
    META TRACKING
    =====================================================
    */

    lastStatusUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    statusUpdatedBy: {
      type: String,
      default: "",
    },
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
OrderSchema.index({ createdAt: -1 });

/*
====================================================
AUTO DELIVERY UPDATE
====================================================
*/

OrderSchema.pre("save", function (next) {
  if (this.status === 4) {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }

  next();
});

/*
====================================================
VIRTUAL STATUS TEXT
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