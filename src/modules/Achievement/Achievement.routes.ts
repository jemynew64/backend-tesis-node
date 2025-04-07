import { Router } from "express";
import { createAchievement,deleteAchievement,getAchievement,getAchievementById,updateAchievement } from "./Achievement.controller";
import { authenticate } from "../../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getAchievement);
router.post("/",authenticate, createAchievement);

router.get("/:id", authenticate, getAchievementById);
router.put("/:id", authenticate, updateAchievement);
router.delete("/:id", authenticate, deleteAchievement);
export default router;