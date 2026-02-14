import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { createReturn, getReturns, updateReturn } from "../controllers/returnController.js";

const router = express.Router();

// Users can create return
router.post("/", protect, createReturn);

// Admin routes
router.use(protect, adminOnly);
router.get("/", getReturns);
router.put("/:id", updateReturn);

export default router;
