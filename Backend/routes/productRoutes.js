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

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */

// Get all products
// GET /api/products
router.get("/", getALLproducts);

// Get single product by ID
// GET /api/products/find/1
router.get("/find/:id", getProduct);


/* =========================================================
   USER ROUTES (Logged in users)
   ========================================================= */

// Rate product
// POST /api/products/rating/1
router.post("/rating/:id", protect, ratingProduct);


/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Create product
// POST /api/products
router.post("/", protect, adminOnly, createProduct);

// Update product
// PUT /api/products/1
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product
// DELETE /api/products/1
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;