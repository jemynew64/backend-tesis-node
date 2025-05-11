import { Router } from "express";
import { updateStatsController } from "./Stats.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// Ruta para actualizar stats acumulativamente
router.patch("/",authenticate, updateStatsController);

export default router;
