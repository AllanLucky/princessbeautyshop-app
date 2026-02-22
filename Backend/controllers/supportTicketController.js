import SupportTicket from "../models/supportTicketModel.js";
import asyncHandler from "express-async-handler";

// ================= CREATE SUPPORT TICKET =================
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

// ================= GET ALL TICKETS =================
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

// ================= GET SINGLE TICKET =================
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate("user", "name email")
    .populate("product", "title");

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  res.status(200).json({
    success: true,
    ticket,
  });
});

// ================= UPDATE TICKET =================
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  const allowedFields = ["subject", "message", "status", "adminNote"];

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

// ================= DELETE TICKET =================
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  res.status(200).json({
    success: true,
    message: "Ticket deleted successfully",
  });
});

export {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};