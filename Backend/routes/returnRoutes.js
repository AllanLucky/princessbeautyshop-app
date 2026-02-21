import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createReturn,
  getReturns,
  getUserReturns,
  updateReturn,
} from "../controllers/returnController.js";

const router = express.Router();

/*
====================================================
 USER ROUTES
====================================================
*/

// Create return request
router.post("/", protect, createReturn);

// Get logged-in user's returns
router.get("/my-returns", protect, getUserReturns);

/*
====================================================
 ADMIN ROUTES
====================================================
*/

// Get all returns
router.get("/", protect, adminOnly, getReturns);

// Get single return by ID (admin)
router.get("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const Return = (await import("../models/returnModel.js")).default;

    const ret = await Return.findById(req.params.id)
      .populate("userId", "name email")
      .populate("orderId")
      .populate("productId");

    if (!ret) {
      return res.status(404).json({ message: "Return not found" });
    }

    res.json({ success: true, return: ret });
  } catch (err) {
    next(err);
  }
});

// Update return (admin)
router.put("/:id", protect, adminOnly, updateReturn);

export default router;