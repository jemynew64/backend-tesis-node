import { Router } from "express";
import { 
  createLeccion,
  deleteLeccion,
  getLeccion,
  getLeccionById,
  updateLeccion 
} from "./leccion.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getLeccion);
router.post("/", authenticate, createLeccion);
// router.get("/unidad/:unidadId", authenticate, getLeccionesByUnidad);
router.get("/:id", authenticate, getLeccionById);
router.put("/:id", authenticate, updateLeccion);
router.delete("/:id", authenticate, deleteLeccion);

export default router;