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

// Create a ticket (any logged-in user)
router.post("/", protect, createTicket);

// Get a single ticket (user/admin)
router.get("/:id", protect, getTicket);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Get all tickets
router.get("/", protect, adminOnly, getAllTickets);

// Update ticket
router.put("/:id", protect, adminOnly, updateTicket);

// Delete ticket
router.delete("/:id", protect, adminOnly, deleteTicket);

export default router;
