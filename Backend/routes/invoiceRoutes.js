import express from "express";
import Invoice from "../models/InvoiceModel.js"; // <- Make sure this is imported
import {
  createInvoice,
  getInvoice,
  generateInvoicePDF,
} from "../controllers/invoiceController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"; // <- Check folder name

const router = express.Router();

// Admin creates an invoice from an order
router.post("/", protect, adminOnly, createInvoice);

// Any authenticated user can fetch their invoice
router.get("/:invoiceId", protect, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId).populate("customer order");

    if (!invoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }

    // Only allow admin or invoice owner to access
    if (req.user.role !== "admin" && req.user._id.toString() !== invoice.customer._id.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

// Generate PDF — same rules
router.get("/:invoiceId/pdf", protect, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId).populate("customer order");

    if (!invoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== invoice.customer._id.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }

    // Generate PDF
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Princess Beauty Shop Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Customer: ${invoice.customer.name}`, 20, 50);
    doc.text(`Email: ${invoice.customer.email}`, 20, 60);
    doc.text(`Date: ${invoice.createdAt.toDateString()}`, 20, 70);

    let y = 90;
    invoice.products.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.name} | Qty: ${p.quantity} | Price: $${p.price}`, 20, y);
      y += 10;
    });

    doc.text(`Subtotal: $${invoice.subtotal}`, 20, y + 10);
    doc.text(`Tax: $${invoice.tax}`, 20, y + 20);
    doc.text(`Shipping: $${invoice.shippingFee}`, 20, y + 30);
    doc.text(`Total Paid: $${invoice.totalPaid}`, 20, y + 40);

    const pdfData = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`);
    res.send(Buffer.from(pdfData));

  } catch (error) {
    next(error);
  }
});

export default router;


