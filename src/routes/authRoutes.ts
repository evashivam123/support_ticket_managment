import { Router } from "express";
import { authHandler } from "../handlers/authHandler.js";

const router = Router();
router.post("/signup", (req, res) => authHandler.signup(req, res));
router.post("/login", (req, res) => authHandler.login(req, res));

export default router;
