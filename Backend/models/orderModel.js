import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // Customer info
    name: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },

    // Products
    products: [
      {
        productId: String,
        title: String,
        desc: String, // optional: keep product description
        price: Number,
        quantity: Number,
        img: String,
      },
    ],

    // Money
    total: { type: Number, required: true },
    currency: { type: String, default: "KES" },

    // Stripe info
    paymentIntentId: { type: String },
    stripeSessionId: { type: String },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    declineReason: { type: String }, // ✅ capture failed payment reason

    // Order lifecycle
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    isDelivered: { type: Boolean, default: false }
    deliveredAt: { type: Date },
    refundedAt: { type: Date }, // ✅ capture refund date
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError in dev hot-reload
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
