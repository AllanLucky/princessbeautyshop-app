import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { createCoupon, getCoupons, updateCoupon, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", createCoupon);
router.get("/", getCoupons);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
