import express from "express";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- ADMIN ROUTES ----------------
// Only admin/superadmin can manage coupons
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

// ---------------- PUBLIC / CHECKOUT ----------------
// Validate coupon before order
router.post("/validate", protect, validateCoupon);

export default router;