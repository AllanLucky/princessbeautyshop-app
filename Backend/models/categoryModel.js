import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==================================
INDEX OPTIMIZATION ⭐
==================================
*/

// Unique constraint already creates index automatically

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

export default Category;