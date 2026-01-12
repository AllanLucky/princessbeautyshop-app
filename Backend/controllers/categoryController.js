import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// CREATE CATEGORY
const createCategory = asyncHandler(async (req, res) => {
  const { name, image, description } = req.body;
  const newCategory = new Category({ name, image, description });
  const category = await newCategory.save();
  res.status(201).json(category);
});

// GET ALL CATEGORIES
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(categories);
});

export { createCategory, getAllCategories };
