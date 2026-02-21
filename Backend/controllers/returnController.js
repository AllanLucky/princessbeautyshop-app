import Return from "../models/returnModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
 CREATE RETURN REQUEST (USER)
====================================================
*/

export const createReturn = asyncHandler(async (req, res) => {
  if (!req.body.orderId || !req.body.reason) {
    res.status(400);
    throw new Error("Order ID and reason are required");
  }

  const returnRequest = await Return.create({
    userId: req.user._id,
    orderId: req.body.orderId,
    reason: req.body.reason,
    refundAmount: req.body.refundAmount || 0,
    status: "pending",
  });

  res.status(201).json({
    success: true,
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
    .populate("orderId")
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

  const allowedUpdates = ["status", "adminNote", "refundAmount"];

  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

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
    return: ret,
  });
});