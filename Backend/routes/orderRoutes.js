import express from "express";
import {
  getAllOrders,
  getUserOrder,
  deleteOrder,
  createOrder,
  updateOrder,
  getOrderById
} from "../controllers/orderController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
=====================================================
 USER ORDER OPERATIONS
=====================================================
*/

// Create order
router.post("/", protect, createOrder);

// Get user orders (placed before dynamic routes)
router.get("/user/:id", protect, getUserOrder);

// Get single order (use explicit path to avoid route collision)
router.get("/find/:id", protect, getOrderById);

/*
=====================================================
 ADMIN ORDER MANAGEMENT
=====================================================
*/

// Update order status (ADMIN ONLY)
router.put("/:id", protect, adminOnly, updateOrder);

// Get all orders (ADMIN ONLY)
router.get("/", protect, adminOnly, getAllOrders);

// Delete order (ADMIN ONLY)
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;