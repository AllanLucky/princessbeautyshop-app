import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
 INVENTORY HELPERS (SAFE VERSION ⭐ PRODUCTION READY)
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

  await product.save({
    validateBeforeSave: false,
  });
};

const addStock = async (productId, quantity) => {
  if (!productId || !quantity) return;

  const product = await Product.findById(productId);

  if (!product) return;

  product.stock += quantity;

  await product.save({
    validateBeforeSave: false,
  });
};

/*
====================================================
 CREATE ORDER
====================================================
*/

const createOrder = asyncHandler(async (req, res) => {
  const { products, total, currency, userId } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  const orderUserId =
    req.user.role === "admin" || req.user.role === "super_admin"
      ? userId || req.user._id
      : req.user._id;

  // Inventory deduction safely
  for (const item of products) {
    await deductStock(item?.productId, item?.quantity);
  }

  const order = await Order.create({
    userId: orderUserId,
    products,
    total,
    currency: currency || "KES",

    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    phone: req.body.phone || req.user.phone || "",
    address: req.body.address || req.user.address || "",

    orderStatus: "processing",
    paymentStatus: "pending",
  });

  res.status(201).json({
    success: true,
    order,
  });
});

/*
====================================================
 UPDATE ORDER ⭐ ENTERPRISE SAFE LOGIC
====================================================
*/

const updateOrder = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only");
  }

  const { orderStatus, paymentStatus } = req.body;

  const updateData = {};

  if (orderStatus) updateData.orderStatus = orderStatus;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  /*
  ============================================
  AUTO SYNC RULES
  ============================================
  */

  if (orderStatus === "delivered") {
    updateData.paymentStatus = "paid";
    updateData.isDelivered = true;
    updateData.deliveredAt = new Date();
  }

  if (orderStatus === "cancelled") {
    updateData.isDelivered = false;
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({
    success: true,
    order,
  });
});

/*
====================================================
 DELETE ORDER (SAFE STOCK RESTORE ⭐)
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
        await addStock(item?.productId, item?.quantity);
      } catch (err) {
        console.error("Stock restore error:", err.message);
      }
    }
  }

  await order.deleteOne();

  res.json({
    success: true,
    message: "Order deleted successfully",
  });
});

/*
====================================================
 GET USER ORDERS
====================================================
*/

const getUserOrder = asyncHandler(async (req, res) => {
  if (
    req.user._id.toString() !== req.params.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  const orders = await Order.find({
    userId: req.params.id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    total: orders.length,
    orders,
  });
});

/*
====================================================
 GET ORDER BY ID
====================================================
*/

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({
    success: true,
    order,
  });
});

/*
====================================================
 GET ALL ORDERS (ADMIN)
====================================================
*/

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