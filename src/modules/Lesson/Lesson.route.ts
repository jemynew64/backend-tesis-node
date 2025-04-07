import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getLessonById,
  updateLesson,
} from "./Lesson.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getLessons);
router.post("/", authenticate, createLesson);
router.get("/:id", authenticate, getLessonById);
router.put("/:id", authenticate, updateLesson);
router.delete("/:id", authenticate, deleteLesson);

export default router;
