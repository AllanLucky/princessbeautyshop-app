import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/supportTicketController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   USER ROUTES
   ========================================================= */

// Create support ticket (authenticated user)
router.post("/", protect, createTicket);

// Get user's own ticket detail
router.get("/detail/:id", protect, getTicket);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Get all tickets (admin only)
router.get("/admin/all", protect, adminOnly, getAllTickets);

// Update ticket (admin only)
router.put("/admin/:id", protect, adminOnly, updateTicket);

// Delete ticket (admin only)
router.delete("/admin/:id", protect, adminOnly, deleteTicket);

export default router;