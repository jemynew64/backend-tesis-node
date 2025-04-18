// src/modules/Challenge/Challenge.routes.ts
import { Router } from "express";
import {
  createChallenge,
  deleteChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  getChallengesByLessonId,
} from "./Challenge.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getChallenges);
router.post("/", authenticate, createChallenge);
router.get("/lesson/:lesson_id", authenticate, getChallengesByLessonId);

router.get("/:id", authenticate, getChallengeById);
router.put("/:id", authenticate, updateChallenge);
router.delete("/:id", authenticate, deleteChallenge);


// routes/challenge.routes.ts
// import multer from "multer";
// const upload = multer({ storage: multer.memoryStorage() }); // o diskStorage si lo necesitas

// router.post("/upload-image", upload.single("file"), uploadImage);


export default router;
