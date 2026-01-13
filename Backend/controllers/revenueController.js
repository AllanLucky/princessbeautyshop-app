import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// Get total revenue
export const getTotalRevenue = asyncHandler(async (req, res) => {
  const orders = await Order.find({ paymentStatus: "paid" });

  const revenue = orders.reduce((sum, order) => {
    return sum + order.total;
  }, 0);

  res.json({
    revenue,
    orders: orders.length,
  });
});

// Get monthly revenue
export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  const orders = await Order.find({
    paymentStatus: "paid",
    createdAt: { $gte: lastMonth },
  });

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  res.json({
    revenue,
    orders: orders.length,
  });
});
