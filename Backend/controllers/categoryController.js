import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// ================= GET ALL CATEGORIES =================
// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: categories });
});

// ================= GET SINGLE CATEGORY =================
// @desc    Get a category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({ success: true, data: category });
});

// ================= CREATE CATEGORY =================
// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

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
    image: image || "", // Cloudinary secure_url passed from frontend
    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    data: newCategory,
    message: "Category created successfully",
  });
});

// ================= UPDATE CATEGORY =================
// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const { name, description, image } = req.body;

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (image) category.image = image; // Cloudinary secure_url

  await category.save();

  res.status(200).json({
    success: true,
    data: category,
    message: "Category updated successfully",
  });
});

// ================= DELETE CATEGORY =================
// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await Category.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
