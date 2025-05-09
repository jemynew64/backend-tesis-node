import { Router } from "express";
import {
  getUserMissionHandler,
  createUserMissionHandler,
  getUserMissionByIdHandler,
  updateUserMissionHandler,
  deleteUserMissionHandler,
  getUserMissionsTodayHandler, // 👈 IMPORTA esto
} from "./UserMission.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUserMissionHandler);
router.get("/today", authenticate, getUserMissionsTodayHandler); // 👈 NUEVA RUTA
router.post("/", authenticate, createUserMissionHandler);

router.get("/:id", authenticate, getUserMissionByIdHandler);
router.put("/:id", authenticate, updateUserMissionHandler);
router.delete("/:id", authenticate, deleteUserMissionHandler);

export default router;
