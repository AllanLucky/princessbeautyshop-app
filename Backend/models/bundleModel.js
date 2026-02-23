
import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    badge: {
      type: String,
      enum: ["BEST VALUE", "POPULAR", "PREMIUM", "NEW"],
      default: null,
      index: true,
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          index: true,
        },

        title: String,
        desc: String,

        img: {
          type: [String],
          default: [],
        },

        originalPrice: {
          type: Number,
          default: 0,
        },

        discountedPrice: {
          type: Number,
          default: 0,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    categories: {
      type: [String],
      default: [],
      index: true,
    },

    concern: {
      type: [String],
      default: [],
    },

    skintype: {
      type: [String],
      default: [],
    },

    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },

    isPrebuilt: {
      type: Boolean,
      default: true,
      index: true,
    },

    customBundleProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

BundleSchema.index({ name: 1 });
BundleSchema.index({ createdAt: -1 });
BundleSchema.index({ originalPrice: 1, discountedPrice: 1 });

const Bundle = mongoose.model("Bundle", BundleSchema);

export default Bundle;