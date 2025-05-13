// 📁 src/modules/EarnedAchievement/EarnedAchievement.route.ts

import { Router } from "express";
import {
  getEarnedAchievements,
  getEarnedAchievementById,
  createEarnedAchievement,
  deleteEarnedAchievement,
  updateEarnedAchievement,
  autoCheckAchievements,
} from "./EarnedAchievement.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getEarnedAchievements);
router.post("/", authenticate, createEarnedAchievement);
router.get("/:id", authenticate, getEarnedAchievementById);
router.put("/:id", authenticate, updateEarnedAchievement);
router.delete("/:id", authenticate, deleteEarnedAchievement);
router.post("/auto-check", authenticate, autoCheckAchievements);

export default router;

