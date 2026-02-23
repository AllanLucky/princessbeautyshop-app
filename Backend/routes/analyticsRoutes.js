import express from "express";
const router = express.Router();

import {
  createAnalyticsRecord,
  getAllAnalytics,
  getAnalyticsSummary,
  getUserActivity,
} from "../controllers/analyticsController.js";

/*
=====================================================
ANALYTICS ROUTES
=====================================================
*/

// Create analytics record
router.post("/", createAnalyticsRecord);

// Get analytics list
router.get("/", getAllAnalytics);

// Analytics summary dashboard
router.get("/summary", getAnalyticsSummary);

// User activity tracking
router.get("/user/:userId", getUserActivity);

export default router;