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

// ================= PUBLIC ROUTES =================
router.get("/", getAllCategories); // get all categories

// ================= ADMIN ROUTES =================
router.post("/", protect, adminOnly, createCategory); // create new category
router.get("/:id", protect, adminOnly, getCategoryById); // get single category
router.put("/:id", protect, adminOnly, updateCategory); // update category
router.delete("/:id", protect, adminOnly, deleteCategory); // delete category

export default router;
