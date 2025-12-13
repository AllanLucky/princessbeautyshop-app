import express from "express"
import { getAllUsers, getSingleUser, updateUser, deleteUser } from "../controllers/userController.js";
const router = express.Router();

// GET ALL USERS
router.get("/", getAllUsers);

// SINGLE USER
router.get("/:id", getSingleUser);

// UPDATE USER
router.put("/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

export default router