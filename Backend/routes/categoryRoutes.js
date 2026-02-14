import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories (public)
router.get("/", getAllCategories);

// @route   POST /api/categories
// @desc    Create a new category (admin only)
router.post("/", protect, adminOnly, createCategory);

// @route   PUT /api/categories/:id
// @desc    Update a category (admin only)
router.put("/:id", protect, adminOnly, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category (admin only)
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
