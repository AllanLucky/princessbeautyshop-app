// src/controllers/orderController.js

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
 STATUS WORKFLOW VALIDATION ⭐ ENTERPRISE SAFE
 Pending → Confirmed → Processing → Shipped → Delivered → Cancelled
====================================================
*/

const ALLOWED_TRANSITIONS = {
  0: [1, 5],        // Pending → Confirmed / Cancelled
  1: [2, 5],        // Confirmed → Processing / Cancelled
  2: [3, 5],        // Processing → Shipped / Cancelled
  3: [4, 5],        // Shipped → Delivered / Cancelled
  4: [],            // Delivered is terminal
  5: [],            // Cancelled terminal
};

/*
====================================================
 INVENTORY HELPERS
====================================================
*/

const deductStock = async (productId, quantity) => {
  if (!productId || !quantity) return;

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for ${product.title}`);
  }

  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
};

const addStock = async (productId, quantity) => {
  if (!productId || !quantity) return;

  const product = await Product.findById(productId);
  if (!product) return;

  product.stock += quantity;
  await product.save({ validateBeforeSave: false });
};

/*
====================================================
 CREATE ORDER
====================================================
*/

const createOrder = asyncHandler(async (req, res) => {
  const { products, total, currency } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("Order items required");
  }

  const order = await Order.create({
    userId: req.user._id,
    products,
    total,
    currency: currency || "KES",
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    phone: req.body.phone || req.user.phone || "",
    address: req.body.address || req.user.address || "",
    status: 0,
    paymentStatus: "pending",
    deliveredEmailSent: false,
  });

  /*
  Deduct stock safely
  */
  for (const item of products) {
    await deductStock(item.productId, item.quantity);
  }

  res.status(201).json({
    success: true,
    order,
  });
});

/*
====================================================
 UPDATE ORDER ⭐ ENTERPRISE SAFE WORKFLOW
====================================================
*/

const updateOrder = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only");
  }

  const { status, paymentStatus, note, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  /*
  ===== STATUS TRANSITION GUARD ⭐
  */

  if (status !== undefined && status !== order.status) {
    const allowed = ALLOWED_TRANSITIONS[order.status] || [];

    if (!allowed.includes(status)) {
      throw new Error("Invalid order status transition");
    }

    order.status = status;

    /*
    Timeline tracking
    */

    order.statusHistory.push({
      status,
      note: note || "",
      date: new Date(),
    });

    /*
    Payment + delivery sync
    */

    if (status === 4) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.deliveredEmailSent = false;
      order.paymentStatus = "paid";
    }

    if (status === 5) {
      order.paymentStatus = "failed";
    }
  }

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  await order.save();

  res.json({
    success: true,
    order,
  });
});

/*
====================================================
 DELETE ORDER ⭐ STOCK RESTORE
====================================================
*/

const deleteOrder = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (Array.isArray(order.products)) {
    for (const item of order.products) {
      try {
        await addStock(item.productId, item.quantity);
      } catch (err) {
        console.error(err.message);
      }
    }
  }

  await order.deleteOne();

  res.json({
    success: true,
    message: "Order deleted",
  });
});

/*
====================================================
 GETTERS
====================================================
*/

const getUserOrder = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (req.user._id.toString() !== userId && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized");
  }

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  res.json({
    success: true,
    total: orders.length,
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw new Error("Order not found");

  res.json({
    success: true,
    order,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only");
  }

  const orders = await Order.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    total: orders.length,
    orders,
  });
});

/*
====================================================
 EXPORTS
====================================================
*/

export {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrder,
  getAllOrders,
  getOrderById,
};