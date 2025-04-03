import { Router } from "express";
import { createReto,deleteReto,getReto,getRetoById,updateReto } from "../controllers/reto.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getReto);
router.post("/",authenticate, createReto);

router.get("/:id", authenticate, getRetoById);
router.put("/:id", authenticate, updateReto);
router.delete("/:id", authenticate, deleteReto);
export default router;