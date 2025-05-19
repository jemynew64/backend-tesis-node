import { Router } from "express";
import { updateUnitsProgressController } from "./UnitProgress.controller"; // ajusta el path
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// POST /progress/update-units/:courseId
router.post("/progress/:courseId",authenticate, updateUnitsProgressController);

export default router;
