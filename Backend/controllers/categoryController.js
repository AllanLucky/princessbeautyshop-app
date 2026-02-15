import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// ================= GET ALL CATEGORIES =================
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  // Return array directly (matches Products API)
  res.status(200).json(categories);
});

// ================= CREATE CATEGORY =================
// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  // Check if category exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(400);
    throw new Error("Category with this name already exists");
  }

  const newCategory = await Category.create({
    name,
    description: description || "",
    createdBy: req.user._id,
  });

  res.status(201).json(newCategory);
});

// ================= UPDATE CATEGORY =================
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Merge request body into category
  Object.assign(category, req.body);
  await category.save();

  res.status(200).json(category);
});

// ================= DELETE CATEGORY =================
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({ message: "Category deleted successfully" });
});

export { getAllCategories, createCategory, updateCategory, deleteCategory };
