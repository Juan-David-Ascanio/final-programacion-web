import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser, forgotPassword, verifyPin, resetPassword} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-pin", verifyPin);
router.post("/reset-password", resetPassword);

export default router;
