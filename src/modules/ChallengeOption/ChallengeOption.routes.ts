import { Router } from "express";
import {
  createOption,
  deleteOption,
  getOptions,
  getOptionById,
  updateOption,
} from "./ChallengeOption.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getOptions);
router.post("/", authenticate, createOption);
router.get("/:id", authenticate, getOptionById);
router.put("/:id", authenticate, updateOption);
router.delete("/:id", authenticate, deleteOption);

export default router;
