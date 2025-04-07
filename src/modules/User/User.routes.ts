import { Router } from "express";
import { getUsersHandler, createUserHandler, deleteUserHandler, getUserByIdHandler, updateUserHandler } from "./User.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUsersHandler);
router.post("/", authenticate, createUserHandler);

router.get("/:id", authenticate, getUserByIdHandler);
router.put("/:id", authenticate, updateUserHandler);
router.delete("/:id", authenticate, deleteUserHandler);

export default router;
