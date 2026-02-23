import express from "express";
import {
  createTimetable,
  getAllTimetables,
  getUserTimetables,
  updateTimetableStatus,
  deleteTimetable,
} from "../controllers/TimeTableController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
=====================================================
PUBLIC ROUTES (If timetable submission is allowed)
=====================================================
*/

// User can create timetable request
router.post("/", createTimetable);

// User timetable history
router.get("/user", protect, getUserTimetables);

/*
=====================================================
ADMIN ROUTES ⭐ PROTECTED
=====================================================
*/

router.get("/", protect, adminOnly, getAllTimetables);

router.put("/:id/status", protect, adminOnly, updateTimetableStatus);

router.delete("/:id", protect, adminOnly, deleteTimetable);

export default router;