import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    /*
    ==========================================
    CUSTOMER INFO
    ==========================================
    */

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
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

    /*
    ==========================================
    PRODUCTS
    ==========================================
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

        /*
        ⭐ Stripe-safe string storage
        */
        img: {
          type: String,
          default: "",
        },
      },
    ],

    /*
    ==========================================
    PAYMENT
    ==========================================
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

    /*
    Stripe Tracking
    */
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
    ==========================================
    ORDER LIFE CYCLE
    ==========================================
    */

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

    paidAt: Date,

    refundedAt: Date,
  },
  {
    timestamps: true,
  }
);

/*
==========================================
INDEXING (VERY IMPORTANT FOR FINTECH SCALE)
==========================================
*/

OrderSchema.index({ userId: 1, paymentStatus: 1 });
OrderSchema.index({ stripeSessionId: 1 });

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;