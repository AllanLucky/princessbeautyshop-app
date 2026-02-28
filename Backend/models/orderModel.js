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
    PRODUCTS
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
    PAYMENT
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
    },

    declineReason: {
      type: String,
      default: "",
    },

    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paymentIntentId: {
      type: String,
      default: "",
    },

    /*
    ORDER LIFE CYCLE
    */

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

    paidAt: Date,

    refundedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==========================================
INDEX OPTIMIZATION ⭐
==========================================
*/

OrderSchema.index({ userId: 1, paymentStatus: 1 });

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;