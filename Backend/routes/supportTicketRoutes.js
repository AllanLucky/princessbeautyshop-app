import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  getUserTickets, // fetch tickets of logged-in user
} from "../controllers/supportTicketController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   USER ROUTES
   ========================================================= */

// Create a support ticket (authenticated user)
router.post("/", protect, createTicket);

// Get all tickets of the logged-in user
router.get("/user/all", protect, getUserTickets);

// Get single ticket of the logged-in user
router.get("/user/detail/:id", protect, getTicket);

// Optional: Update user's own ticket (e.g., if open or in progress)
router.put("/user/:id", protect, updateTicket);

// Optional: Delete user's own ticket
router.delete("/user/:id", protect, deleteTicket);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Get all tickets (admin only)
router.get("/admin/all", protect, adminOnly, getAllTickets);

// Get single ticket (admin can view any ticket)
router.get("/admin/detail/:id", protect, adminOnly, getTicket);

// Update any ticket (admin only)
router.put("/admin/:id", protect, adminOnly, updateTicket);

// Delete any ticket (admin only)
router.delete("/admin/:id", protect, adminOnly, deleteTicket);

export default router;