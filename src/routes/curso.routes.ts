import { Router } from "express";
import { createCurso,deleteCurso,getCurso,getCursoById,updateCurso } from "../controllers/curso.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getCurso);
router.post("/",authenticate, createCurso);

router.get("/:id", authenticate, getCursoById);
router.put("/:id", authenticate, updateCurso);
router.delete("/:id", authenticate, deleteCurso);
export default router;