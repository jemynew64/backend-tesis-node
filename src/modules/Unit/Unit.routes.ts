import { Router } from "express";
import { createUnit, deleteUnit, getUnit, getUnitById, updateUnit } from "./Unit.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUnit);
router.post("/", authenticate, createUnit);
router.get("/:id", authenticate, getUnitById);
router.put("/:id", authenticate, updateUnit);
router.delete("/:id", authenticate, deleteUnit);

export default router;
