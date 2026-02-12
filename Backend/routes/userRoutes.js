import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,

  // 🔥 USER FEATURES
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
// base: /api/v1/users
// =======================================================

// ================= MY PROFILE =================

// GET MY PROFILE
router.get("/me", protect, getMyProfile);

// UPDATE MY PROFILE
router.put("/update-profile", protect, updateMyProfile);

// CHANGE PASSWORD
router.put("/change-password", protect, changePassword);

// UPLOAD AVATAR
router.put(
  "/upload-avatar",
  protect,
  upload.single("avatar"), // form-data field name = avatar
  uploadAvatar
);

// DELETE MY ACCOUNT
router.delete("/delete-account", protect, deleteMyAccount);



// =======================================================
// 👑 ADMIN ROUTES (MUST BE BELOW /me ROUTES)
// =======================================================

// GET ALL USERS
router.get("/", protect, adminOnly, getAllUsers);

// GET SINGLE USER (FOR EDIT PAGE)
router.get("/:id", protect, adminOnly, getSingleUser);

// 🔥 UPDATE USER (EDIT USER PAGE)
router.put("/:id", protect, adminOnly, updateUser);

// DELETE USER
router.delete("/:id", protect, adminOnly, deleteUser);


export default router;