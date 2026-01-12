import express from "express";
import { createCategory, getAllCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory); // create new category
router.get("/", getAllCategories); // get all categories

export default router;