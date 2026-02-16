import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // ✅ added description field
    image: { type: String },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
