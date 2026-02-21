import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processing", "completed"],
      default: "pending",
      index: true,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    adminNote: {
      type: String,
      default: "",
    },

    refundedAt: Date,
  },
  { timestamps: true }
);

/*
==========================================
INDEXING (PERFORMANCE + SCALABILITY)
==========================================
*/

returnSchema.index({ userId: 1, status: 1 });
returnSchema.index({ orderId: 1, status: 1 });

export default mongoose.model("Return", returnSchema);