import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// CREATE ORDER
const createOrder = asyncHandler(async (req, res) => {
  const newOrder = new Order(req.body);
  const savedOrder = await newOrder.save();
  if (!savedOrder) {
    res.status(400);
    throw new Error("Order was not created");
  } else {
    res.status(201).json(savedOrder);
  }
});

// UPDATE ORDER
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
    res.status(201).json(updatedOrder);
  }
});

// DELETE ORDER
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    res.status(400);
    throw new Error("Order was not deleted successfully");
  } else {
    res.status(200).json(order);
  }
});

// GET USER ORDER
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.id })
    .populate("userId", "name email") // populate user info
    .populate("products.product", "name price"); // populate product info

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders were found for this user.");
  } else {
    res.status(200).json(orders.reverse());
  }
});

// GET ALL ORDERS
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email") // populate user info
    .populate("products.product", "name price"); // populate product info

  if (!orders) {
    res.status(400);
    throw new Error("No order was found or something went wrong");
  } else {
    res.status(200).json(orders);
  }
});

export { getAllOrders, getUserOrders, deleteOrder, createOrder, updateOrder };
