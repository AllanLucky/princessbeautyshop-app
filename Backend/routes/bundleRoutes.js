import express from "express";
import {
  createBundle,
  updateBundle,
  deleteBundle,
  getBundle,
  getAllBundles,
  createCustomBundle,
} from "../controllers/bundleController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
=====================================================
PUBLIC ROUTES
=====================================================
*/

// Get all bundles
router.get("/", getAllBundles);

// Get single bundle
router.get("/:id", getBundle);

/*
=====================================================
ADMIN ROUTES ⭐
=====================================================
*/

// Create bundle (admin only)
router.post("/", protect, adminOnly, createBundle);

// Update bundle
router.put("/:id", protect, adminOnly, updateBundle);

// Delete bundle
router.delete("/:id", protect, adminOnly, deleteBundle);

/*
=====================================================
CUSTOM BUNDLE ROUTES
=====================================================
*/

// Create custom bundle (logged-in users)
router.post("/custom/create", protect, createCustomBundle);

export default router;