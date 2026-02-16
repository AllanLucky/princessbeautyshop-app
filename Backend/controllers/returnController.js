import Return from "../models/returnModel.js";
import asyncHandler from "express-async-handler";

// Create return request
export const createReturn = asyncHandler(async (req, res) => {
  const ret = await Return.create({ ...req.body, userId: req.user._id });
  res.status(201).json({ success: true, ret });
});

// Get all returns (Admin)
export const getReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find().populate("userId productId orderId");
  res.json(returns);
});

// Update return status
export const updateReturn = asyncHandler(async (req, res) => {
  const ret = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ret) throw new Error("Return not found");
  res.json({ success: true, ret });
});
