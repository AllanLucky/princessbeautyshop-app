import Notification from "../models/notificationModel.js";
import asyncHandler from "express-async-handler";

// ================= CREATE NOTIFICATION =================
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, userId } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error("Title and message are required");
  }

  const notification = await Notification.create({
    title,
    message,
    user: userId || req.user?._id || null,
    read: false,
  });

  res.status(201).json({
    success: true,
    notification,
  });
});

// ================= GET USER NOTIFICATIONS =================
const getUserNotifications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const notifications = await Notification.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    total,
    page,
    notifications,
  });
});

// ================= MARK SINGLE AS READ =================
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification,
  });
});

// ================= MARK ALL AS READ =================
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// ================= DELETE NOTIFICATION =================
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});

export {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};