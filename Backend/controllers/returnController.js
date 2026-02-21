import Return from "../models/returnModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
 CREATE RETURN REQUEST (USER)
====================================================
*/

export const createReturn = asyncHandler(async (req, res) => {
  const { orderId, productId, reason, refundAmount } = req.body;

  if (!orderId || !productId || !reason) {
    res.status(400);
    throw new Error("Order ID, Product ID and reason are required");
  }

  // ✅ Check order exists
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // ✅ Prevent duplicate return for same product in same order
  const existingReturn = await Return.findOne({
    orderId,
    productId,
    userId: req.user._id,
  });

  if (existingReturn) {
    res.status(400);
    throw new Error("Return already requested for this product");
  }

  const returnRequest = await Return.create({
    userId: req.user._id,
    orderId,
    productId,
    reason,
    refundAmount: refundAmount || 0,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Return request created",
    return: returnRequest,
  });
});

/*
====================================================
 GET ALL RETURNS (ADMIN ONLY)
====================================================
*/

export const getReturns = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only");
  }

  const returns = await Return.find()
    .populate("userId", "name email")
    .populate("orderId", "_id total createdAt")
    .populate("productId", "title price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    total: returns.length,
    returns,
  });
});

/*
====================================================
 GET USER RETURNS (USER)
====================================================
*/

export const getUserReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find({ userId: req.user._id })
    .populate("orderId", "_id total createdAt")
    .populate("productId", "title price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    total: returns.length,
    returns,
  });
});

/*
====================================================
 UPDATE RETURN STATUS (ADMIN ONLY)
====================================================
*/

export const updateReturn = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only");
  }

  const { status, adminNote, refundAmount } = req.body;

  const allowedStatuses = [
    "pending",
    "approved",
    "rejected",
    "processing",
    "completed",
  ];

  const updates = {};

  if (status && allowedStatuses.includes(status)) {
    updates.status = status;
  }

  if (adminNote !== undefined) {
    updates.adminNote = adminNote;
  }

  if (refundAmount !== undefined) {
    updates.refundAmount = refundAmount;
  }

  const ret = await Return.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );

  if (!ret) {
    res.status(404);
    throw new Error("Return not found");
  }

  res.json({
    success: true,
    message: "Return updated successfully",
    return: ret,
  });
});