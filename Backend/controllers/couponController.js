import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";

// CREATE COUPON
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// GET ALL COUPONS
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

// UPDATE COUPON
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) throw new Error("Coupon not found");
  res.json({ success: true, coupon });
});

// DELETE COUPON
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new Error("Coupon not found");
  res.json({ success: true, message: "Coupon deleted" });
});
