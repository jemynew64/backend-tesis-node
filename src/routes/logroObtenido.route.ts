import { Router } from "express";
import { createLogroObtenido,deleteLogroObtenido,getLogroObtenidoById,getLogroObtenidoObtenido,updateLogroObtenido } from "../controllers/logro.obtenido.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getLogroObtenidoObtenido);
router.post("/",authenticate, createLogroObtenido);

router.get("/:id", authenticate, getLogroObtenidoById);
router.put("/:id", authenticate, updateLogroObtenido);
router.delete("/:id", authenticate, deleteLogroObtenido);
export default router;