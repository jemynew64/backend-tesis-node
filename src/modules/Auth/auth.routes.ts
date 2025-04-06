import { Router } from "express";
import  { login } from "./auth.controller"; 

const router = Router();

//* Public Routes
router.post("/login", login);

export default router;
