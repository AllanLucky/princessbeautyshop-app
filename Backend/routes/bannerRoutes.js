import express from "express";
const router = express.Router();

import {
  createInvoice,
  getInvoice,
  generateInvoicePDF,
} from "../controllers/invoiceController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

/**
 * @route   POST /api/v1/invoices
 * @desc    Create a new invoice from an order
 * @access  Admin
 */
router.post("/", protect, adminOnly, createInvoice);

/**
 * @route   GET /api/v1/invoices/:invoiceId
 * @desc    Get invoice by ID (admin or owner)
 * @access  Admin / Invoice owner
 */
router.get("/:invoiceId", protect, getInvoice);

/**
 * @route   GET /api/v1/invoices/:invoiceId/pdf
 * @desc    Generate PDF for a specific invoice (admin or owner)
 * @access  Admin / Invoice owner
 */
router.get("/:invoiceId/pdf", protect, generateInvoicePDF);

/* Optional: List all invoices (admin only) */
/**
 * @route   GET /api/v1/invoices
 * @desc    Get all invoices
 * @access  Admin
 */
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const Invoice = (await import("../models/invoiceModel.js")).default;
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

/* Optional: Delete an invoice (admin only) */
/**
 * @route   DELETE /api/v1/invoices/:invoiceId
 * @desc    Delete an invoice by ID
 * @access  Admin
 */
router.delete("/:invoiceId", protect, adminOnly, async (req, res, next) => {
  try {
    const Invoice = (await import("../models/invoiceModel.js")).default;
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    await invoice.remove();
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
