import asyncHandler from "express-async-handler";
import Invoice from "../models/InvoiceModel.js";
import Order from "../models/OrderModel.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Helper to generate unique invoice numbers
const generateInvoiceNumber = () => {
  return "INV-" + Date.now();
};

// @desc    Generate invoice PDF
// @route   POST /api/invoices/generate/:orderId
// @access  Admin
export const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate("user");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if invoice already exists for this order
  const existingInvoice = await Invoice.findOne({ order: order._id });
  if (existingInvoice) {
    return res.status(400).json({ message: "Invoice already generated" });
  }

  // Generate PDF
  const invoiceNumber = generateInvoiceNumber();
  const pdfPath = path.join(
    "uploads/invoices",
    `${invoiceNumber}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(25).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Invoice Number: ${invoiceNumber}`);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`User: ${order.user.name}`);
  doc.text(`Amount: KES ${order.totalAmount.toLocaleString()}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Status: PAID`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();

  // Save invoice in DB
  const invoice = await Invoice.create({
    invoiceNumber,
    order: order._id,
    user: order.user._id,
    amount: order.totalAmount,
    paymentMethod: order.paymentMethod || "Cash",
    status: "PAID",
    pdfUrl: pdfPath,
  });

  res.status(201).json(invoice);
});

// @desc    Get all invoices (admin)
// @route   GET /api/invoices
// @access  Admin
export const getAllInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find()
    .populate("user", "name email")
    .populate("order", "totalAmount");
  res.json(invoices);
});

// @desc    Get logged-in user's invoices
// @route   GET /api/invoices/my
// @access  Private
export const getUserInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user._id }).populate(
    "order",
    "totalAmount"
  );
  res.json(invoices);
});

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Admin
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user", "name email")
    .populate("order", "totalAmount");
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }
  res.json(invoice);
});

// @desc    Download invoice PDF
// @route   GET /api/invoices/download/:id
// @access  Admin / Owner
export const downloadInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  // Check if user is admin or owner
  if (!req.user.isAdmin && invoice.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to download this invoice");
  }

  res.download(invoice.pdfUrl);
});

