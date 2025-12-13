import express from "express";
import { createOrder, updateOrder, deleteOrder, getUserOrders, getAllOrders, } from "../controllers/orderController.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private/User
router.post("/", createOrder);

// @route   PUT /api/orders/:id
// @desc    Update an order
// @access  Private/Admin
router.put("/:id", updateOrder);

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private/Admin
router.delete("/:id", deleteOrder);

// @route   GET /api/orders/user/:userId
// @desc    Get orders for a specific user
// @access  Private/User
router.get("/user/:userId", getUserOrders);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get("/", protect, getAllOrders);

export default router;