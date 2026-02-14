import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   USER ROUTES
   ========================================================= */

// Get current user notifications
router.get("/", protect, getUserNotifications);

// Mark notification as read
router.put("/read/:id", protect, markAsRead);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Create notification for a user
router.post("/", protect, adminOnly, createNotification);

// Delete notification
router.delete("/:id", protect, adminOnly, deleteNotification);

export default router;
