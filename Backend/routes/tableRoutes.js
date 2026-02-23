import express from "express";
const router = express.Router();

import {
  createTimetable,
  getAllTimetables,
  getUserTimetables,
  updateTimetableStatus,
  deleteTimetable,
} from "../controllers/timetable.controller.js";
import  { protect, adminOnly } from "../middlewares/authMiddleware.js";

/*
=====================================================
PUBLIC ROUTE
=====================================================
*/

// Create timetable request (public submission)
router.post("/", createTimetable);

/*
=====================================================
USER ROUTES ⭐ AUTH REQUIRED
=====================================================
*/

router.get("/my", protect, getUserTimetables);

/*
=====================================================
ADMIN ROUTES ⭐ PROTECTED
=====================================================
*/

// Get all timetable requests (admin dashboard)
router.get("/", protect, adminOnly, getAllTimetables);

// Update timetable processing status
router.put("/:id/status", protect, adminOnly, updateTimetableStatus);

// Delete timetable request
router.delete("/:id", protect, adminOnly, deleteTimetable);

export default router;