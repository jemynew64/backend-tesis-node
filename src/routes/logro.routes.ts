import { Router } from "express";
import { createLogro,deleteLogro,getLogro,getLogroById,updateLogro } from "../controllers/logro.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getLogro);
router.post("/",authenticate, createLogro);

router.get("/:id", authenticate, getLogroById);
router.put("/:id", authenticate, updateLogro);
router.delete("/:id", authenticate, deleteLogro);
export default router;