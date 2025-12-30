import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getALLproducts,
  ratingProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Admin-only routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Public routes
router.get("/find/:id", getProduct); // <-- single product by ID
router.get("/", getALLproducts);

// Logged-in users can rate
router.post("/rating/:id", protect, ratingProduct);

export default router;

