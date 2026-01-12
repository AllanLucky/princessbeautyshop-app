import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, required: true }, // category banner/image
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
export default Category;
