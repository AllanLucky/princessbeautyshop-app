import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// ================= GET ALL CATEGORIES =================
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: categories });
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

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(400);
    throw new Error("Category with this name already exists");
  }

  const newCategory = await Category.create({
    name,
    description: description || "",
    createdBy: req.user._id, // requires protect middleware
  });

  res.status(201).json({
    success: true,
    data: newCategory,
    message: "Category created successfully",
  });
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

  const { name, description } = req.body;

  if (name) category.name = name;
  if (description !== undefined) category.description = description;

  await category.save();

  res.json({
    success: true,
    data: category,
    message: "Category updated successfully",
  });
});

// ================= DELETE CATEGORY =================
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.remove();

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});

export { getAllCategories, createCategory, updateCategory, deleteCategory };
