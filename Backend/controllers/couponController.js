import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";

// ================= CREATE COUPON =================
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountValue, discountType, expiresAt, usageLimit, minOrderAmount } = req.body;

  if (!code || !discountValue) {
    res.status(400);
    throw new Error("Coupon code and discount value are required");
  }

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

  res.status(201).json({ success: true, message: "Coupon created successfully", coupon });
});

// ================= GET ALL COUPONS =================
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, total: coupons.length, coupons });
});

// ================= UPDATE COUPON =================
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
  res.status(200).json({ success: true, message: "Coupon updated successfully", coupon: updatedCoupon });
});

// ================= DELETE COUPON =================
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();
  res.status(200).json({ success: true, message: "Coupon deleted successfully" });
});

// ================= VALIDATE COUPON =================
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ valid: false, message: "Invalid or inactive coupon" });

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return res.status(400).json({ valid: false, message: "Coupon has expired" });
  }

  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({ valid: false, message: `Minimum order amount for this coupon is KES ${coupon.minOrderAmount}` });
  }

  if (coupon.usageLimit && coupon.usageLimit <= 0) {
    return res.status(400).json({ valid: false, message: "Coupon usage limit reached" });
  }

  res.status(200).json({ valid: true, discountValue: coupon.discountValue, discountType: coupon.discountType, message: "Coupon is valid" });
});