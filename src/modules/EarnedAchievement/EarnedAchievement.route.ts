import { Router } from "express";
import { createEarnedAchievement,deleteEarnedAchievement,getEarnedAchievementById,getEarnedAchievements,updateEarnedAchievement } from "./EarnedAchievement.controller";
import { authenticate } from "../../middlewares/auth.middleware";



const router = Router();

router.get("/",authenticate, getEarnedAchievements);
router.post("/",authenticate, createEarnedAchievement);

router.get("/:id", authenticate, getEarnedAchievementById);
router.put("/:id", authenticate, updateEarnedAchievement);
router.delete("/:id", authenticate, deleteEarnedAchievement);
export default router;