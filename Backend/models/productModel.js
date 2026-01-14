import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    whatinbox: {
      type: String,
      trim: true,
    },
    img: {
      type: [String],
      required: true,
    },
    video: {
      type: String,
    },
    wholesalePrice: {
      type: Number,
    },
    wholesaleMinimumQuantity: {
      type: Number,
    },
    categories: {
      type: [String],
    },
    concern: {
      type: [String],
    },
    brand: {
      type: String,
      trim: true,
    },
    skintype: {
      type: [String],
    },
    originalPrice: {
      type: Number,
    },
    discountedPrice: {
      type: Number,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    ratings: [
      {
        star: { type: Number, required: true }, // Number for calculations
        name: { type: String, trim: true },
        comment: { type: String, trim: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Full text search index for all string fields
ProductSchema.index({ "$**": "text" });

// ✅ Fix OverwriteModelError:
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
