import {
  ratingProduct,
  getALLproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import express from "express";
const router = express.Router();

// RATING PRODUCT ROUTE
router.put("/rating/:id", ratingProduct);
// GET ALL PRODUCTS
router.get("/", getALLproducts);
// GET ONE PRODUCT
router.get("/find/:id", getProduct);
//CREATE PRODUCT
router.post("/", createProduct);
// UPDATE PRODUCT
router.put("/:id", updateProduct);

//DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;