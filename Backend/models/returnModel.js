import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "processing",
        "completed",
      ],
      default: "pending",
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundMethod: {
      type: String,
      enum: ["stripe", "manual", "wallet", null],
      default: null,
    },

    refundTransactionId: {
      type: String,
      default: null,
    },

    adminNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    attachments: [
      {
        type: String,
      },
    ],

    refundedAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
====================================================
 PERFORMANCE INDEXES (NO DUPLICATION)
====================================================
*/

// Dashboard filtering
returnSchema.index({ userId: 1, status: 1 });

// Order filtering
returnSchema.index({ orderId: 1, status: 1 });

// Prevent duplicate return request
returnSchema.index(
  { orderId: 1, productId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.model("Return", returnSchema);