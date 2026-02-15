import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js"; // 👈 multer

const router = express.Router();

// ================= PUBLIC =================
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// ================= ADMIN =================

// Create Category (with image)
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),   // 👈 IMPORTANT
  createCategory
);

// Update Category (with image)
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),   // 👈 IMPORTANT
  updateCategory
);

// Delete Category
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
