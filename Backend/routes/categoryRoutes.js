import express from "express";
import { getAllCategories, createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories); // fetch all categories
router.post("/", createCategory); // create category

export default router;
