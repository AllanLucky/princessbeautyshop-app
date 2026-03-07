import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
STATUS WORKFLOW VALIDATION
====================================================
*/

const ALLOWED_TRANSITIONS = {
  0: [1, 5],
  1: [2, 5],
  2: [3, 5],
  3: [4, 5],
  4: [],
  5: [],
};

const STATUS_PROGRESS = {
  0: 10,
  1: 30,
  2: 55,
  3: 80,
  4: 100,
  5: 0,
};

const DELIVERY_ESTIMATE_DAYS = {
  1: 5,
  2: 4,
  3: 3,
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
  try {
    const { products, total, currency } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items required"
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      products,
      total,
      currency: currency || "KES",
      name: req.body.name || req.user.name,
      email: req.body.email || req.user.email,
      phone: req.body.phone || "",
      address: req.body.address || "",
      status: 0,
      progress: STATUS_PROGRESS[0],
      paymentStatus: "pending",
      deliveredEmailSent: false,
    });

    for (const item of products || []) {
      if (!item?.productId) continue;
      await deductStock(item.productId, item.quantity || 0);
    }

    return res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    throw error;
  }
});

/*
====================================================
UPDATE ORDER
====================================================
*/

const updateOrder = asyncHandler(async (req, res) => {

  if (!["admin", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin only"
    });
  }

  const { status, paymentStatus, note, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  /*
  STATUS WORKFLOW VALIDATION
  */

  if (status !== undefined) {

    const newStatus = Number(status);
    const currentStatus = Number(order.status);

    if (newStatus !== currentStatus) {

      const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

      if (!allowed.includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status transition"
        });
      }

      order.status = newStatus;
      order.progress = STATUS_PROGRESS[newStatus] || 0;
      order.lastStatusUpdatedAt = new Date();

      /*
      DELIVERY ESTIMATION
      */

      if (DELIVERY_ESTIMATE_DAYS[newStatus]) {
        const eta = new Date();
        eta.setDate(
          eta.getDate() + DELIVERY_ESTIMATE_DAYS[newStatus]
        );

        order.estimatedDeliveryDate = eta;
      }

      /*
      HISTORY TRACKING
      */

      order.statusHistory = order.statusHistory || [];

      order.statusHistory.push({
        status: newStatus,
        note: note || "",
        date: new Date(),
      });

      /*
      DELIVERY LOGIC
      */

      if (newStatus === 4) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.deliveredEmailSent = false;
        order.paymentStatus = "paid";
      }

      if (newStatus === 5) {
        order.paymentStatus = "failed";
      }
    }
  }

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  await order.save({ validateBeforeSave: false });

  return res.json({
    success: true,
    order
  });
});

/*
====================================================
DELETE ORDER
====================================================
*/

const deleteOrder = asyncHandler(async (req, res) => {

  if (!["admin", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin only"
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  if (Array.isArray(order.products)) {
    for (const item of order.products) {
      try {
        await addStock(item?.productId, item?.quantity || 0);
      } catch (err) {
        console.error(err.message);
      }
    }
  }

  await order.deleteOne();

  return res.json({
    success: true,
    message: "Order deleted"
  });
});

/*
====================================================
GET USER ORDERS
====================================================
*/

const getUserOrder = asyncHandler(async (req, res) => {

  const userId = req.params.id;

  if (
    req.user._id.toString() !== userId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    total: orders.length,
    orders,
  });
});

/*
====================================================
GET SINGLE ORDER
====================================================
*/

const getOrderById = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  res.json({
    success: true,
    order
  });
});

/*
====================================================
GET ALL ORDERS
====================================================
*/

const getAllOrders = asyncHandler(async (req, res) => {

  if (!["admin", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin only"
    });
  }

  const orders = await Order.find()
    .sort({ createdAt: -1 });

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
  getOrderById,
};