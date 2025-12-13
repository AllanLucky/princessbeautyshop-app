import express from "express";
import {
  getProducts,
  rateProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ========================
// PRODUCT ROUTES
// ========================

// GET ALL PRODUCTS
// GET /api/v1/products
router.get("/", getProducts);

// GET SINGLE PRODUCT
// GET /api/v1/products/:id
router.get("/:id", getProductById);

// CREATE PRODUCT
// POST /api/v1/products
router.post("/", createProduct);

// UPDATE PRODUCT
// PUT /api/v1/products/:id
router.put("/:id", updateProduct);

// DELETE PRODUCT
// DELETE /api/v1/products/:id
router.delete("/:id", deleteProduct);

// RATE PRODUCT
// PUT /api/v1/products/rating/:productId
router.put("/rating/:productId", rateProduct);

export default router;