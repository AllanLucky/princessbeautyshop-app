import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= PUBLIC =================
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// ================= ADMIN =================

// Create Category (Cloudinary URL passed in req.body.image)
router.post("/", protect, adminOnly, createCategory);

// Update Category (Cloudinary URL passed in req.body.image)
router.put("/:id", protect, adminOnly, updateCategory);

// Delete Category
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
