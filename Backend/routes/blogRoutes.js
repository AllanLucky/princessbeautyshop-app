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

/*
====================================================
 PUBLIC BLOG ROUTES
====================================================
*/

// Get all blogs (public, frontend accessible)
router.get("/", getAllBlogs);

// Get single blog by ID (public, frontend accessible)
router.get("/:id", getBlog);

/*
====================================================
 ADMIN BLOG MANAGEMENT ROUTES
====================================================
*/

// Create a new blog (admin only)
router.post("/", protect, adminOnly, createBlog);

// Update an existing blog (admin only)
router.put("/:id", protect, adminOnly, updateBlog);

// Delete a blog (admin only)
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;