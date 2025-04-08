import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  getCourseById,
  updateCourse,
  getcourseidunitlesson
} from "./Course.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getCourses);
router.post("/", authenticate, createCourse);
router.get("/:id", authenticate, getCourseById);
router.get("/:id/:user_id/v2", authenticate, getcourseidunitlesson);
router.put("/:id", authenticate, updateCourse);
router.delete("/:id", authenticate, deleteCourse);

export default router;
