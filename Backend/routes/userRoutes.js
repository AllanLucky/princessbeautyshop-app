import express from "express";
import {
  // Admin features
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,

  // User features
  getMyProfile,
  updateMyProfile,
  changePassword,
  uploadAvatar,
  deleteMyAccount,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// =======================================================
// 🔐 LOGGED-IN USER ROUTES
// Base URL: /api/v1/users
// =======================================================

// -------- MY PROFILE --------

// Get logged-in user's profile
router.get("/me", protect, getMyProfile);

// Update logged-in user's profile
router.put("/update-profile", protect, updateMyProfile);

// Change password
router.put("/change-password", protect, changePassword);

// Upload avatar (supports local storage; can be switched to Cloudinary)
router.put(
  "/upload-avatar",
  protect,
  upload.single("avatar"), // form-data field name = avatar
  uploadAvatar
);

// Delete logged-in user's account
router.delete("/delete-account", protect, deleteMyAccount);

// =======================================================
// 👑 ADMIN ROUTES (must be after /me routes to avoid conflicts)
// =======================================================

// Get all users (admin only)
router.get("/", protect, adminOnly, getAllUsers);

// Get single user by ID (admin only)
router.get("/:id", protect, adminOnly, getSingleUser);

// Update a user by ID (admin only)
router.put("/:id", protect, adminOnly, updateUser);

// Delete a user by ID (admin only)
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
