// src/modules/ImportExcel/importExcel.routes.ts
import express from "express";
import multer from "multer";
import { handleExcelUpload } from "./importExcel.controller";

const router = express.Router();

// 🧠 Cambiado para usar memoria en lugar de disco
const upload = multer({ storage: multer.memoryStorage() });

router.post("/unidad-completa", upload.single("file"), handleExcelUpload);

export default router;
