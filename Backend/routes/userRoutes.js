import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET ALL USERS - admin only
router.get("/", protect, adminOnly, getAllUsers);

// SINGLE USER - admin only
router.get("/:id", protect, adminOnly, getSingleUser);

// UPDATE USER - admin only
router.put("/:id", protect, adminOnly, updateUser);

// DELETE USER - admin only
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
