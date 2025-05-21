import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { ShopLivesController } from "./Shop.controller";
import { authorize } from "../../middlewares/authorize"; // 👈 nuevo

const router = Router();

router.post("/", authenticate, authorize(["admin", "student"]) ,ShopLivesController )

export default router;
