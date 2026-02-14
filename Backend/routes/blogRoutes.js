import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */

// Get all blogs
router.get("/", getAllBlogs);

// Get single blog
router.get("/:id", getBlog);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Create blog
router.post("/", protect, adminOnly, createBlog);

// Update blog
router.put("/:id", protect, adminOnly, updateBlog);

// Delete blog
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;
