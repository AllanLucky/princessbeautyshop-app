import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
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
      },
    ],
  },
  {
    timestamps: true,
  }
);


// 🔥 AUTO UPDATE STOCK STATUS

ProductSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;
  next();
});


// 🔥 ALSO UPDATE WHEN USING findByIdAndUpdate

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