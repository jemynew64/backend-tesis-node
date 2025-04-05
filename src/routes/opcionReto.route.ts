import { Router } from "express";
import { createOpcionReto,deleteOpcionReto,getOpcionReto,getOpcionRetoById,updateOpcionReto } from "../controllers/opcion.reto.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getOpcionReto);
router.post("/",authenticate, createOpcionReto);

router.get("/:id", authenticate, getOpcionRetoById);
router.put("/:id", authenticate, updateOpcionReto);
router.delete("/:id", authenticate, deleteOpcionReto);
export default router;