// src/modules/Challenge/Challenge.routes.ts
import { Router } from "express";
import {
  createChallenge,
  deleteChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
} from "./Challenge.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getChallenges);
router.post("/", authenticate, createChallenge);

router.get("/:id", authenticate, getChallengeById);
router.put("/:id", authenticate, updateChallenge);
router.delete("/:id", authenticate, deleteChallenge);

export default router;
