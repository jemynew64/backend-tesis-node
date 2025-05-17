import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { quizzUserPoints,isLessonCompleted } from "./Quiz.controller";
import { authorize } from "../../middlewares/authorize"; // 👈 nuevo

const router = Router();

router.post("/", authenticate, authorize(["admin", "student"]) ,quizzUserPoints )
// GET para verificar si se completó una lección
router.get("/status", authenticate, authorize(["admin", "student"]), isLessonCompleted);
export default router;
