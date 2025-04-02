import { Router } from "express";
import { getUsuarios,createUsuario,deleteUsuario,getUsuarioById,updateUsuario } from "../controllers/usuario.controller"
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/",authenticate, getUsuarios);
router.post("/",authenticate, createUsuario);

router.get("/:id", authenticate, getUsuarioById);
router.put("/:id", authenticate, updateUsuario);
router.delete("/:id", authenticate, deleteUsuario);
export default router;