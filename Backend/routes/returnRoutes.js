import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createReturn,
  getReturns,
  updateReturn,
} from "../controllers/returnController.js";

const router = express.Router();

/*
====================================================
 USER ROUTES
====================================================
*/

// User create return request
router.post("/", protect, createReturn);

/*
====================================================
 ADMIN ROUTES
====================================================
*/

// Admin get all returns
router.get("/", protect, adminOnly, getReturns);

// Admin update return status
router.put("/:id", protect, adminOnly, updateReturn);

export default router;