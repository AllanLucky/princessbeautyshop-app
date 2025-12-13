import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/User
const createOrder = asyncHandler(async (req, res) => {
  const order = new Order(req.body);
  const savedOrder = await order.save();

  if (!savedOrder) {
    res.status(400);
    throw new Error("Order was not created");
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order: savedOrder,
  });
});

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    order,
  });
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    order,
  });
});

// @desc    Get orders for a specific user
// @route   GET /api/orders/user/:userId
// @access  Private/User
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found for this user");
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found");
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

export {
  createOrder, updateOrder, getUserOrders, getAllOrders, deleteOrder,
};
