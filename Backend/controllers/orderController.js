import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// ================= Inventory Helpers =================

const deductStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for ${product.title}`);
  }

  product.stock -= quantity;
  await product.save();
};

const addStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  product.stock += quantity;
  await product.save();
};

// ================= CREATE ORDER (customer OR admin) =================

const createOrder = asyncHandler(async (req, res) => {
  const { products, total, currency, userId } = req.body;

  if (!products || products.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // 🔐 Determine order owner
  const orderUserId =
    req.user.role === "admin" || req.user.role === "super_admin"
      ? userId || req.user._id
      : req.user._id;

  // Stock validation
  for (const item of products) {
    await deductStock(item.productId, item.quantity);
  }

  const order = await Order.create({
    userId: orderUserId,
    products,
    total,
    currency: currency || "KES",

    // Customer info (admin can override)
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    phone: req.body.phone || req.user.phone,
    address: req.body.address || req.user.address,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

// ================= UPDATE ORDER =================

const updateOrder = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    delete updates.userId;
    delete updates.paymentStatus;
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );

  if (!updatedOrder) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({
    success: true,
    order: updatedOrder,
  });
});

// ================= DELETE ORDER =================

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Restore inventory
  for (const item of order.products) {
    await addStock(item.productId, item.quantity);
  }

  await order.deleteOne();

  res.json({
    success: true,
    message: "Order deleted and stock restored",
  });
});

// ================= GET USER ORDERS =================

const getUserOrder = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized");
  }

  const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    total: orders.length,
    orders,
  });
});

// ================= GET ALL ORDERS =================

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

export {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrder,
  getAllOrders,
};
