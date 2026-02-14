import express from "express";
import {
  createVendor,
  getVendors,
  getVendorById, // added
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// VENDOR ROUTES Admin 

router.post("/", protect, adminOnly, createVendor);
router.get("/", protect, adminOnly, getVendors)
router.get("/:id", protect, adminOnly, getVendorById);
router.put("/:id", protect, adminOnly, updateVendor);
router.delete("/:id", protect, adminOnly, deleteVendor);

export default router;
