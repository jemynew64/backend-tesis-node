import { Router } from "express";
import { updateStatsController,getStatsController,getStatsdiaryController  } from "./Stats.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// Ruta para actualizar stats acumulativamente
router.patch("/",authenticate, updateStatsController);
router.get("/", authenticate, getStatsController);
router.get("/today", authenticate, getStatsdiaryController);

export default router;
