import express from "express";
const router = express.Router();
import {
  getAllOrders,
  getUserOrder,
  deleteOrder,
  createOrder,
  updateOrder
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

// CREATE ORDER ROUTE - only logged-in users
router.post("/", protect, createOrder);

// UPDATE ORDER ROUTE - only logged-in users
router.put("/:id", protect, updateOrder);

// GET ALL ORDERS ROUTE - admin only
router.get("/", protect, adminOnly, getAllOrders);

// DELETE ORDER ROUTE - admin only
router.delete("/:id", protect, adminOnly, deleteOrder);

// GET USER'S ORDER ROUTE - only the user or admin
router.get("/find/:id", protect, getUserOrder);

export default router;
