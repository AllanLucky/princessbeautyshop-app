import express from "express";
const router = express.Router();

import {
  createClinicAssessment,
  getAllClinicAssessments,
  getClinicAssessmentById,
  updateAssessmentStatus,
  deleteAssessment,
  getUserAssessments,
} from "../controllers/clinicController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

/*
=====================================================
PUBLIC ROUTE
=====================================================
*/

// Anyone can submit assessment
router.post("/", createClinicAssessment);

/*
=====================================================
USER ROUTES ⭐ AUTH REQUIRED
=====================================================
*/

router.get("/my-assessments", protect, getUserAssessments);

/*
=====================================================
ADMIN ROUTES ⭐ PROTECTED
=====================================================
*/

// List all assessments (admin dashboard)
router.get("/", protect, adminOnly, getAllClinicAssessments);

// Get assessment by ID
router.get("/:id", protect, adminOnly, getClinicAssessmentById);

// Update assessment status
router.put("/:id", protect, adminOnly, updateAssessmentStatus);

// Delete assessment
router.delete("/:id", protect, adminOnly, deleteAssessment);

export default router;