import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public or Admin (depending on your system)
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, categories });
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  // Optional: check for existing category with same name
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(400);
    throw new Error("Category with this name already exists");
  }

  const newCategory = await Category.create({
    name,
    description: description || "",
    createdBy: req.user._id, // Admin ID if using protect middleware
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category: newCategory,
  });
});

// Optional: Update a category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  Object.assign(category, req.body);
  await category.save();

  res.json({ success: true, message: "Category updated successfully", category });
});

// Optional: Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.remove();
  res.json({ success: true, message: "Category deleted successfully" });
});

export { getAllCategories, createCategory, updateCategory, deleteCategory };
