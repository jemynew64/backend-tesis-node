import { Router } from "express";
import {createProgresoLeccion,deleteProgresoLeccion,getProgresoLeccion,getProgresoLeccionById,updateProgresoLeccion } from "./progreso.leccion.controller";
import { authenticate } from "../../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getProgresoLeccion);
router.post("/",authenticate, createProgresoLeccion);

router.get("/:id", authenticate, getProgresoLeccionById);
router.put("/:id", authenticate, updateProgresoLeccion);
router.delete("/:id", authenticate, deleteProgresoLeccion);
export default router;