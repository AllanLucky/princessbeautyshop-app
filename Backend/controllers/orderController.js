import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// CREATE ORDER - user must be logged in
const createOrder = asyncHandler(async (req, res) => {
  const newOrder = new Order({
    ...req.body,
    userId: req.user._id, // force logged-in user
  });

  const savedOrder = await newOrder.save();

  if (!savedOrder) {
    res.status(400);
    throw new Error("Order was not created");
  } else {
    res.status(201).json(savedOrder);
  }
});

// UPDATE ORDER - user/admin
const updateOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedOrder) {
    res.status(400);
    throw new Error("Order was not updated");
  } else {
    res.status(200).json(updatedOrder);
  }
});

// DELETE ORDER - admin only
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    res.status(400);
    throw new Error("Order was not deleted successfully");
  } else {
    res.status(200).json(order);
  }
});

// GET ORDERS OF A USER
const getUserOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders were found for this user.");
  } else {
    res.status(200).json(orders);
  }
});

// GET ALL ORDERS - admin only
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }); // latest first

  if (!orders) {
    res.status(400);
    throw new Error("No orders were found or something went wrong");
  } else {
    res.status(200).json(orders);
  }
});

export { getAllOrders, getUserOrder, deleteOrder, createOrder, updateOrder };
