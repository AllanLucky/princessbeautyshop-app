import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// ✅ Get total revenue (only paid orders)
export const getTotalRevenue = asyncHandler(async (req, res) => {
  const orders = await Order.find({ paymentStatus: "paid" });

  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  res.status(200).json({
    revenue,
    orders: orders.length,
  });
});

// ✅ Get last month's revenue (only paid orders)
export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const now = new Date();

  // First and last day of previous month
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const orders = await Order.find({
    paymentStatus: "paid",
    createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
  });

  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  res.status(200).json({
    revenue,
    orders: orders.length,
    period: `${firstDayLastMonth.toDateString()} - ${lastDayLastMonth.toDateString()}`,
  });
});
