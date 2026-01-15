import asyncHandler from "express-async-handler";
import Invoice from "../models/InvoiceModel.js";
import Order from "../models/orderModel.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Helper: generate unique invoice numbers
const generateInvoiceNumber = () => `INV-${Date.now()}`;

// @desc    Generate invoice PDF
// @route   POST /api/invoices/generate/:orderId
// @access  Admin
export const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if invoice already exists
  const existingInvoice = await Invoice.findOne({ order: order._id });
  if (existingInvoice) {
    return res.status(400).json({ message: "Invoice already generated" });
  }

  const invoiceNumber = generateInvoiceNumber();
  const pdfDir = path.join("uploads", "invoices");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

  const pdfPath = path.join(pdfDir, `${invoiceNumber}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(fs.createWriteStream(pdfPath));

  // Header
  doc.fontSize(25).text("BEAUTY BLISS SHOP", { align: "center" });
  doc.fontSize(14).text("123 BeautyBliss Ave, City, Country", { align: "center" });
  doc.text("Phone: (+254) 788 425 000 | Email: info@beautybliss.com", { align: "center" });
  doc.moveDown(2);

  // Invoice info
  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  // Customer info
  doc.fontSize(14).text("CUSTOMER INFO", { underline: true });
  doc.fontSize(12).text(`Name: ${order.name}`);
  doc.text(`Email: ${order.email}`);
  doc.text(`Phone: ${order.phone || "N/A"}`);
  doc.text(`Address: ${order.address || "N/A"}`);
  doc.moveDown();

  // Invoice details
  doc.fontSize(14).text("ORDER DETAILS", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);
  doc.text("#  Product                    Quantity   Unit Price   Subtotal");
  doc.moveDown(0.5);

  let subtotal = 0;
  order.products.forEach((item, i) => {
    const lineSubtotal = item.price * item.quantity;
    subtotal += lineSubtotal;
    doc.text(
      `${i + 1}  ${item.title.padEnd(25)}  ${item.quantity}          Ksh ${item.price.toLocaleString()}     Ksh ${lineSubtotal.toLocaleString()}`
    );
  });

  doc.moveDown();
  doc.text(`Sub Total: Ksh ${subtotal.toLocaleString()}`);
  doc.text(`Tax: Ksh 0.00`);
  doc.text(`Total: Ksh ${subtotal.toLocaleString()}`);
  doc.moveDown(2);
  doc.text("Thank you for your business!", { align: "center" });

  doc.end();

  // Save invoice in DB
  const invoice = await Invoice.create({
    invoiceNumber,
    order: order._id,
    user: order.userId,
    amount: subtotal,
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
    .populate({ path: "order", select: "name email total createdAt" })
    .sort({ createdAt: -1 });
  res.json(invoices);
});

// @desc    Get logged-in user's invoices
// @route   GET /api/invoices/my
// @access  Private
export const getUserInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user._id })
    .populate({ path: "order", select: "name email total createdAt" })
    .sort({ createdAt: -1 });
  res.json(invoices);
});

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Admin / Owner
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate({ path: "order", select: "name email total createdAt" });
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

  if (!req.user.isAdmin && invoice.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to download this invoice");
  }

  res.download(invoice.pdfUrl);
});

