import { Router } from "express";
import { createMission, deleteMission, getMission, getMissionById, updateMission } from "./Mission.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getMission);
router.post("/", authenticate, createMission);
router.get("/:id", authenticate, getMissionById);
router.put("/:id", authenticate, updateMission);
router.delete("/:id", authenticate, deleteMission);

export default router;
