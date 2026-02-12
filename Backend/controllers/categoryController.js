import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// GET ALL CATEGORIES
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(categories);
});

// CREATE CATEGORY
const createCategory = asyncHandler(async (req, res) => {
  const newCategory = new Category(req.body);
  const savedCategory = await newCategory.save();
  res.status(201).json(savedCategory);
});

export { getAllCategories, createCategory };
