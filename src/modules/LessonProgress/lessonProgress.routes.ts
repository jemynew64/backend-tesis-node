import { Router } from "express";
import { createLessonProgress, deleteLessonProgress, getLessonProgress, getLessonProgressById, updateLessonProgress } from "./LessonProgress.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getLessonProgress);
router.post("/", authenticate, createLessonProgress);
router.get("/:id", authenticate, getLessonProgressById);
router.put("/:id", authenticate, updateLessonProgress);
router.delete("/:id", authenticate, deleteLessonProgress);

export default router;
