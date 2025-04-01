import { Router } from "express";
import  { login } from "../controllers/auth.controller"; 

const router = Router();

//* Public Routes
router.post("/login", login);

export default router;
