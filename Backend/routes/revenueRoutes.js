import express from "express";
import { getTotalRevenue, getMonthlyRevenue } from "../controllers/revenueController.js";
import { adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/total", adminOnly, getTotalRevenue);
router.get("/monthly", adminOnly, getMonthlyRevenue);

export default router;
