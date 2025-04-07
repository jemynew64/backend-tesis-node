import { Router } from "express";
import { createUnidad,deleteUnidad,getUnidad,getUnidadById,updateUnidad } from "./unidad.controller";
import { authenticate } from "../../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getUnidad);
router.post("/",authenticate, createUnidad);

router.get("/:id", authenticate, getUnidadById);
router.put("/:id", authenticate, updateUnidad);
router.delete("/:id", authenticate, deleteUnidad);
export default router;