import { Router } from "express";
import {
  createOption,
  deleteOption,
  getOptions,
  getOptionById,
  updateOption,
  getChallengesByLessonId,
} from "./ChallengeOption.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getOptions);
router.post("/", authenticate, createOption);
router.get("/:id", authenticate, getOptionById);
router.put("/:id", authenticate, updateOption);
router.delete("/:id", authenticate, deleteOption);
router.get("/challengeoption/:challenge_id", authenticate, getChallengesByLessonId);

export default router;
