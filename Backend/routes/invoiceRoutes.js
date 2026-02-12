import express from "express";
import {
  generateInvoice,
  getAllInvoices,
  getUserInvoices,
  getInvoiceById,
  downloadInvoice
} from "../controllers/invoiceController.js";
import {protect, adminOnly} from "../middlewares/authMiddleware.js";
const router = express.Router();

// USER ROUTE - Get logged-in user's invoices
router.get("/my", protect, getUserInvoices);

// ADMIN ROUTES
router.post("/generate/:orderId", protect, adminOnly, generateInvoice);
router.get("/", protect, adminOnly, getAllInvoices);
router.get("/:id", protect, adminOnly, getInvoiceById);

// DOWNLOAD ROUTE - Admin or Owner
router.get("/download/:id", protect, downloadInvoice);


export default router;
