import Payment from "../models/paymentModel.js";
import asyncHandler from "express-async-handler";

/*
=====================================================
CREATE PAYMENT
=====================================================
*/

const createPayment = asyncHandler(async (req, res) => {
  const newPayment = new Payment(req.body);

  const savedPayment = await newPayment.save();

  if (!savedPayment) {
    res.status(400);
    throw new Error("Payment was not created");
  }

  res.status(201).json(savedPayment);
});

/*
=====================================================
DELETE PAYMENT
=====================================================
*/

const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.status(200).json({
    message: "Payment was deleted successfully",
  });
});

/*
=====================================================
GET ALL PAYMENTS ⭐ PAGINATION
=====================================================
*/

const getAllPayments = asyncHandler(async (req, res) => {
  let { page = 1, limit = 20, status, search } = req.query;

  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));

  const query = {};

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { reference: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const payments = await Payment.find(query)
    .populate("orderId", "name email total status")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Payment.countDocuments(query);

  if (!payments) {
    res.status(400);
    throw new Error("Payments were not fetched");
  }

  res.status(200).json({
    data: payments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    },
  });
});

/*
=====================================================
GET PAYMENT BY ID
=====================================================
*/

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate(
    "orderId"
  );

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.status(200).json(payment);
});

/*
=====================================================
UPDATE PAYMENT
=====================================================
*/

const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  ).populate("orderId", "name email total status");

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.status(200).json(payment);
});

/*
=====================================================
GET PAYMENTS BY STATUS
=====================================================
*/

const getPaymentsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  const payments = await Payment.find({ status })
    .populate("orderId", "name email total status")
    .sort({ createdAt: -1 });

  if (!payments) {
    res.status(400);
    throw new Error("Payments were not fetched");
  }

  res.status(200).json(payments);
});

export {
  getAllPayments,
  createPayment,
  deletePayment,
  getPaymentById,
  updatePayment,
  getPaymentsByStatus,
};