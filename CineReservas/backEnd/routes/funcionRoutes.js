import express from "express";
import { getFunciones } from "../controllers/funcionController.js";

const router = express.Router();

router.get("/", getFunciones);

export default router;
