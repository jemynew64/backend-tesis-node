import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

//* Public Routes
router.post("/login", login);

export default router;
