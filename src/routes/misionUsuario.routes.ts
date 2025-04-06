import { Router } from "express";
import { createMisionUsuario,deleteMisionUsuario,getMisionUsuario,getMisionUsuarioById,updateMisionUsuario } from "../controllers/MisionUsuario.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getMisionUsuario);
router.post("/",authenticate, createMisionUsuario);

router.get("/:id", authenticate, getMisionUsuarioById);
router.put("/:id", authenticate, updateMisionUsuario);
router.delete("/:id", authenticate, deleteMisionUsuario);
export default router;