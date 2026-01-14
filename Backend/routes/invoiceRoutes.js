import express from "express";
import {
  createInvoice,
  getInvoice,
  generateInvoicePDF,
  listInvoices,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add `protect` first to verify JWT, then `adminOnly` for role check
router.post("/", protect, adminOnly, createInvoice);
router.get("/:invoiceId", protect, adminOnly, getInvoice);
router.get("/:invoiceId/pdf", protect, adminOnly, generateInvoicePDF);
router.get("/", protect, adminOnly, listInvoices);
router.delete("/:invoiceId", protect, adminOnly, deleteInvoice);

export default router;
