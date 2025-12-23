import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  whatinbox: {
    type: String,
  },
  img: {
    type: [String],
    required: true,
  },
  video: {
    type: String,
  },
  // 👇 Add a single price field
  price: {
    type: Number,
    required: true,
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
      star: { type: String },
      name: { type: String },
      comment: { type: String },
      postedBy: { type: String },
    },
  ],
}, {
  timestamps: true
});

ProductSchema.index({"$**":"text"});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
