import express from "express";
const router = express.Router();
import {getAllOrders, getUserOrder, deleteOrder, createOrder, updateOrder} from "../controllers/orderController.js";
import protect from "../middlewares/authMiddleware.js";

// CREATE ORDER ROUTE
router.post("/", createOrder);
// UPDATE ORDER ROUTE
router.put("/:id", updateOrder);
// GET ALL ORDERS ROUTE
router.get("/",getAllOrders);
// DELETE ORDER ROUTE
router.delete("/:id", deleteOrder);
// GET USER'S ORDER ROUTE
router.get("/find/:id", getUserOrder)

export default router;
