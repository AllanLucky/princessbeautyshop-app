import Notification from "../models/notificationModel.js";
import asyncHandler from "express-async-handler";

// ================= CREATE NOTIFICATION =================
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, userId, read } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error("Title and message are required");
  }

  const notification = await Notification.create({
    title,
    message,
    user: userId || null,
    read: read || false,
  });

  res.status(201).json({ success: true, notification });
});

// ================= GET USER NOTIFICATIONS =================
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(notifications);
});

// ================= MARK AS READ =================
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ success: true, notification });
});

// ================= DELETE NOTIFICATION =================
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.status(200).json({ success: true, message: "Notification deleted successfully" });
});

export { createNotification, getUserNotifications, markAsRead, deleteNotification };
