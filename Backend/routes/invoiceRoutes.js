import express from "express";
import {
  createInvoice,
  getInvoice,
  generateInvoicePDF,
  listInvoices,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import {  adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create invoice (admin only)
router.post("/", adminOnly, createInvoice);

// Get invoice by ID
router.get("/:invoiceId", adminOnly, getInvoice);

// Generate PDF
router.get("/:invoiceId/pdf", adminOnly, generateInvoicePDF);

// List all invoices
router.get("/", adminOnly, listInvoices);
// Delete invoice
router.delete("/:invoiceId", adminOnly, deleteInvoice);

export default router;


