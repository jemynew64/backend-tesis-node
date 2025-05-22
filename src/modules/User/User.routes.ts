import { Router } from "express";
import { getUsersHandler, createUserHandler, deleteUserHandler, getUserByIdHandler, updateUserHandler,ReducerliveController } from "./User.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUsersHandler);
router.post("/", authenticate, createUserHandler);
router.post("/restarlives", authenticate, ReducerliveController);

router.get("/:id", authenticate, getUserByIdHandler);
router.put("/:id", authenticate, updateUserHandler);
router.delete("/:id", authenticate, deleteUserHandler);

export default router;
