import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   USER ROUTES
   ========================================================= */

// Get logged-in user notifications
router.get("/me", protect, getUserNotifications);

// Mark single notification as read
router.put("/read/:id", protect, markAsRead);

// Mark all notifications as read
router.put("/read-all", protect, markAllAsRead);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Create notification (admin broadcast or targeted)
router.post("/", protect, adminOnly, createNotification);

// Delete notification
router.delete("/:id", protect, adminOnly, deleteNotification);

export default router;