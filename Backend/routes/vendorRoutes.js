import express from "express";
import {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All vendor routes protected and accessible to admin & superadmin
router.post("/", protect, adminOnly, createVendor);
router.get("/", protect, adminOnly, getVendors);
router.put("/:id", protect, adminOnly, updateVendor);
router.delete("/:id", protect, adminOnly, deleteVendor); // Admin can now delete vendors

export default router;
