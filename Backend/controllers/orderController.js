import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// CREATE ORDER — only logged-in user
const createOrder = asyncHandler(async (req, res) => {
  const newOrder = new Order({
    ...req.body,
    userId: req.user._id, // force current user
  });

  const savedOrder = await newOrder.save();
  res.status(201).json(savedOrder);
});

// UPDATE ORDER — user/admin
const updateOrder = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.user.role !== "admin") {
    delete updates.userId;
    delete updates.paymentStatus;
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );

  if (!updatedOrder) {
    res.status(400);
    throw new Error("Order was not updated");
  }
  res.status(200).json(updatedOrder);
});

// DELETE ORDER — admin only
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    res.status(400);
    throw new Error("Order was not deleted");
  }
  res.status(200).json(order);
});

// GET USER ORDERS — only owner or admin
const getUserOrder = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to view these orders");
  }

  const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });
  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found for this user.");
  }
  res.status(200).json(orders);
});

// GET ALL ORDERS — admin only
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.status(200).json(orders);
});

export { getAllOrders, getUserOrder, deleteOrder, createOrder, updateOrder };
