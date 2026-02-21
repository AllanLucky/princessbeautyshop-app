import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // Customer info
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },

    // Products
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        title: { type: String, required: true },

        desc: { type: String },

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

        // ⭐ IMPORTANT → Force string (Stripe safe)
        img: {
          type: String,
          default: "",
        },
      },
    ],

    // Money
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "KES",
    },

    // Stripe tracking
    paymentIntentId: String,
    stripeSessionId: String,

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    declineReason: String,

    // Order lifecycle
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
    refundedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;