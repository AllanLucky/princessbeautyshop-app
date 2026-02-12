import express from "express";
import {
  getAllOrders,
  getUserOrder,
  deleteOrder,
  createOrder,
  updateOrder
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", protect, createOrder); // create order
router.put("/:id", protect, updateOrder); // update order
router.get("/", protect, adminOnly, getAllOrders); // all orders admin
router.delete("/:id", protect, adminOnly, deleteOrder); // delete
router.get("/find/:id", protect, getUserOrder); // user's orders

export default router;
