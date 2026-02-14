import mongoose from "mongoose";

// ===== Rating / Review Schema =====
const ratingSchema = new mongoose.Schema(
  {
    star: { type: Number, required: true, min: 1, max: 5 },
    name: { type: String, trim: true },
    comment: { type: String, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ===== Return Policy Schema =====
const returnPolicySchema = new mongoose.Schema({
  reason: { type: String, required: true },
  durationDays: { type: Number, required: true }, // allowed days to return
});

// ===== Product Schema =====
const ProductSchema = new mongoose.Schema(
  {
    // ===== BASIC INFO =====
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    longDesc: { type: String, trim: true },

    // ===== WHAT IN BOX =====
    whatinbox: [
      {
        item: { type: String, trim: true },
        qty: { type: Number, default: 1, min: 1 },
      },
    ],

    // ===== FEATURES =====
    features: [{ type: String, trim: true }],

    // ===== SPECIFICATIONS =====
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    // ===== MEDIA =====
    img: { type: [String], required: true },
    video: { type: String, trim: true },

    // ===== WHOLESALE =====
    wholesalePrice: { type: Number, min: 0 },
    wholesaleMinimumQuantity: { type: Number, min: 1 },

    // ===== CATEGORY / FILTERS =====
    categories: { type: [String], default: [] },
    concern: { type: [String], default: [] },
    skintype: { type: [String], default: [] },
    brand: { type: String, trim: true },

    // ===== PRICES =====
    originalPrice: { type: Number, min: 0, required: true },
    discountedPrice: { type: Number, min: 0 },

    // ===== STOCK SYSTEM =====
    stock: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },

    // ===== RATINGS & REVIEWS =====
    ratings: [ratingSchema],

    // ===== WISHLIST USERS =====
    wishlistUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ===== RETURNS =====
    returnPolicies: [returnPolicySchema],

    // ===== BLOG REFERENCES =====
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],

    // ===== SUPPORT TICKETS =====
    supportTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "SupportTicket" }],

    // ===== CREATED BY ADMIN =====
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

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
