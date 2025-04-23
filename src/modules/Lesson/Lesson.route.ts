import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getLessonById,
  updateLesson,
  completarLeccion,iniciarLeccion
} from "./Lesson.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getLessons);
router.post("/", authenticate, createLesson);
router.get("/:id", authenticate, getLessonById);
router.put("/:id", authenticate, updateLesson);
router.delete("/:id", authenticate, deleteLesson);
// Crear progreso si no existe
router.post("/iniciar/:lessonId/:userId", authenticate, iniciarLeccion);
// Marcar como completado
router.post("/completar/:lessonId/:userId", authenticate, completarLeccion);
export default router;
