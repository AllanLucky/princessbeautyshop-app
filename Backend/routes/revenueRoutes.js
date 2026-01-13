import express from "express";
import { getTotalRevenue, getMonthlyRevenue } from "../controllers/revenueController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/total", verifyAdmin, getTotalRevenue);
router.get("/monthly", verifyAdmin, getMonthlyRevenue);

export default router;
