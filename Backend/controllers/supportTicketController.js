import SupportTicket from "../models/supportTicketModel.js";
import asyncHandler from "express-async-handler";

/* ================= CREATE SUPPORT TICKET ================= */
const createTicket = asyncHandler(async (req, res) => {
  const { subject, message, productId, status } = req.body;

  if (!subject || !message) {
    res.status(400);
    throw new Error("Subject and message are required");
  }

  const ticket = await SupportTicket.create({
    subject,
    message,
    user: req.user?._id,
    product: productId || null,
    status: status || "open",
  });

  res.status(201).json({
    success: true,
    ticket,
  });
});

/* ================= GET ALL TICKETS (ADMIN ONLY) ================= */
const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find()
    .populate("user", "name email")
    .populate("product", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: tickets.length,
    tickets,
  });
});

/* ================= GET TICKETS OF LOGGED-IN USER ================= */
const getUserTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user?._id })
    .populate("product", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: tickets.length,
    tickets,
  });
});

/* ================= GET SINGLE TICKET ================= */
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate("user", "name email")
    .populate("product", "title");

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Restrict non-admin users from viewing other users' tickets
  if (req.user?.role !== "admin" && ticket.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  res.status(200).json({
    success: true,
    ticket,
  });
});

/* ================= UPDATE TICKET ================= */
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Only ticket owner or admin can update
  if (req.user?.role !== "admin" && ticket.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  const allowedFields = ["subject", "message", "status", "adminNote", "responses"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      ticket[field] = req.body[field];
    }
  });

  await ticket.save();

  res.status(200).json({
    success: true,
    message: "Ticket updated successfully",
    ticket,
  });
});

/* ================= DELETE TICKET ================= */
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Only ticket owner or admin can delete
  if (req.user?.role !== "admin" && ticket.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  // Use deleteOne to avoid `.remove()` issues
  await SupportTicket.deleteOne({ _id: ticket._id });

  res.status(200).json({
    success: true,
    message: "Ticket deleted successfully",
  });
});

export {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};