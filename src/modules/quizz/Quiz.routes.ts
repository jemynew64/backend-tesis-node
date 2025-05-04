import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { quizzUserPoints } from "./Quiz.controller";
import { authorize } from "../../middlewares/authorize"; // 👈 nuevo

const router = Router();

router.post("/", authenticate, authorize(["admin", "student"]) ,quizzUserPoints )

export default router;
