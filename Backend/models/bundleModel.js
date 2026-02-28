import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    },

    isPrebuilt: {
      type: Boolean,
      default: true,
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
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

// Compound indexes only (no duplicate field indexes)

BundleSchema.index({ name: 1 });
BundleSchema.index({ createdAt: -1 });
BundleSchema.index({ originalPrice: 1, discountedPrice: 1 });
BundleSchema.index({ inStock: 1 });
BundleSchema.index({ isPrebuilt: 1 });

const Bundle =
  mongoose.models.Bundle || mongoose.model("Bundle", BundleSchema);

export default Bundle;