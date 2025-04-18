import { Router } from "express";
import {
  createChallenge,
  deleteChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  getChallengesByLessonId,
  uploadImage
} from "./Challenge.controller";
import { authenticate } from "../../middlewares/auth.middleware";
//solo para que se suba la imagen
import multer from "multer";

const router = Router();
//solo para que se suba la imagen
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authenticate, getChallenges);
router.post("/", authenticate, createChallenge);
router.get("/lesson/:lesson_id", authenticate, getChallengesByLessonId);
router.get("/:id", authenticate, getChallengeById);
router.put("/:id", authenticate, updateChallenge);
router.delete("/:id", authenticate, deleteChallenge);
//solo para que se suba la imagen
router.post("/upload-image", authenticate, upload.single("file"), uploadImage);

export default router;