import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    // ===== BASIC INFO =====
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 SHORT DESCRIPTION (card/product list)
    desc: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 LONG PROFESSIONAL DESCRIPTION (details page)
    longDesc: {
      type: String,
      trim: true,
    },

    // 🔥 WHAT IN BOX
    whatinbox: {
      type: String,
      trim: true,
    },

    // 🔥 WHAT IN BOX (array of objects with item and qty)
    whatinbox: [
      {
        item: { type: String, trim: true },
        qty: { type: Number, default: 1, min: 1 },
      },
    ],

    // 🔥 FEATURES LIST
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // 🔥 SPECIFICATIONS
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    // ===== MEDIA =====
    img: {
      type: [String],
      required: true,
    },

    video: String,

    // ===== WHOLESALE =====
    wholesalePrice: Number,
    wholesaleMinimumQuantity: Number,

    // ===== CATEGORY =====
    categories: [String],
    concern: [String],
    skintype: [String],
    video: {
      type: String,
      trim: true,
    },

    // ===== WHOLESALE =====
    wholesalePrice: {
      type: Number,
      min: 0,
    },
    wholesaleMinimumQuantity: {
      type: Number,
      min: 1,
    },

    // ===== CATEGORY / FILTERS =====
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

    brand: {
      type: String,
      trim: true,
    },

    // ===== PRICES =====
    originalPrice: Number,
    discountedPrice: Number,

    // ===== STOCK SYSTEM 🔥 =====
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,
      required: true,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },

    // ===== STOCK SYSTEM 🔥 =====
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    // ===== RATINGS =====
    ratings: [
      {
        star: { type: Number, required: true },
        name: { type: String, trim: true },
        comment: { type: String, trim: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        star: { type: Number, required: true, min: 0, max: 5 },
        name: { type: String, trim: true },
        comment: { type: String, trim: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 🔥 AUTO UPDATE STOCK STATUS
// 🔥 AUTO UPDATE STOCK STATUS BEFORE SAVE
ProductSchema.pre("save", function () {
  this.inStock = this.stock > 0;
});

// 🔥 UPDATE STOCK WHEN USING findOneAndUpdate
ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined) {
    update.inStock = update.stock > 0;
  }
  next();
});

// 🔥 FULL TEXT SEARCH
ProductSchema.index({ "$**": "text" });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
