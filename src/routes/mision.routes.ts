import { Router } from "express";
import { createMision,deleteMision,getMision,getMisionById,updateMision} from "../controllers/mision.controller";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getMision);
router.post("/",authenticate, createMision);

router.get("/:id", authenticate, getMisionById);
router.put("/:id", authenticate, updateMision);
router.delete("/:id", authenticate, deleteMision);
export default router;