import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";

// =====================================
// CREATE COUPON
// =====================================
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountValue, discountType, expiresAt, usageLimit, minOrderAmount } = req.body;

  // Required fields
  if (!code || !discountValue) {
    res.status(400);
    throw new Error("Coupon code and discount value are required");
  }

  // Prevent duplicate codes
  const exists = await Coupon.findOne({ code: code.toUpperCase() });
  if (exists) {
    res.status(400);
    throw new Error("Coupon already exists");
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountValue,
    discountType: discountType || "percentage",
    expiresAt,
    usageLimit: usageLimit || 0,
    minOrderAmount: minOrderAmount || 0,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

// =====================================
// GET ALL COUPONS
// =====================================
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: coupons.length,
    coupons,
  });
});

// =====================================
// UPDATE COUPON
// =====================================
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  coupon.code = req.body.code?.toUpperCase() || coupon.code;
  coupon.discountValue = req.body.discountValue ?? coupon.discountValue;
  coupon.discountType = req.body.discountType || coupon.discountType;
  coupon.expiresAt = req.body.expiresAt || coupon.expiresAt;
  coupon.usageLimit = req.body.usageLimit ?? coupon.usageLimit;
  coupon.minOrderAmount = req.body.minOrderAmount ?? coupon.minOrderAmount;
  coupon.isActive = req.body.isActive ?? coupon.isActive;

  const updatedCoupon = await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon: updatedCoupon,
  });
});

// =====================================
// DELETE COUPON
// =====================================
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});
