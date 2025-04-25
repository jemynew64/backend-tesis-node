import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { quizzUserPoints } from "./Quiz.controller";
const router = Router();

router.post("/", authenticate,quizzUserPoints )

export default router;
