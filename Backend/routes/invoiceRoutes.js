import express from "express";
const router = express.Router();

import {
  createInvoice,
  getInvoice,
  generateInvoicePDF,
  listInvoices,
  deleteInvoice,
} from "../controllers/invoiceController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

// CREATE INVOICE
router.post("/", protect, adminOnly, createInvoice);

// GET INVOICE BY ID
router.get("/:invoiceId", protect, getInvoice);

// GENERATE PDF
router.get("/:invoiceId/pdf", protect, generateInvoicePDF);

// LIST ALL INVOICES (ADMIN)
router.get("/", protect, adminOnly, listInvoices);

// DELETE INVOICE (ADMIN)
router.delete("/:invoiceId", protect, adminOnly, deleteInvoice);

export default router;
