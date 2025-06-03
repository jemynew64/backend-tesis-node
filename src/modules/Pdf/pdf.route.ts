import { Router } from "express";
import { getUserReportPDF } from "./pdf.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUserReportPDF);

export default router;
