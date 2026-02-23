import express from "express";
const router = express.Router();

import {
  createPayment,
  getAllPayments,
  deletePayment,
  getPaymentById,
  updatePayment,
  getPaymentsByStatus,
} from "../controllers/paymentController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

/*
=====================================================
PAYMENT ROUTES
=====================================================
*/

// Create payment record
router.post("/", protect, createPayment);

// Get payments list (admin dashboard)
router.get("/", protect, adminOnly, getAllPayments);

// Payment status filter (Put before :id route)
router.get("/status/:status", protect, adminOnly, getPaymentsByStatus);

// Get payment by ID
router.get("/:id", protect, adminOnly, getPaymentById);

// Update payment
router.put("/:id", protect, adminOnly, updatePayment);

// Delete payment
router.delete("/:id", protect, adminOnly, deletePayment);

export default router;