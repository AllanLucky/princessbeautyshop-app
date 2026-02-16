import express from "express";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
| Only admin/superadmin can manage coupons
*/
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

/*
|--------------------------------------------------------------------------
| PUBLIC / CHECKOUT ROUTE (Optional – For Later)
|--------------------------------------------------------------------------
| Validate coupon before order
|
| Example:
| POST /api/coupons/validate
*/
router.post("/validate", protect, async (req, res) => {
  res.json({ message: "Validation endpoint coming soon" });
});

export default router;
