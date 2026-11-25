import { Router } from "express";
import { ticketHandler } from "../handlers/ticketHandler.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authMiddleware);
router.post("/", (req, res) => ticketHandler.create(req, res));
router.get("/", (req, res) => ticketHandler.list(req, res));
router.get("/:id", (req, res) => ticketHandler.get(req, res));
router.patch("/:id", (req, res) => ticketHandler.update(req, res));
router.delete("/:id", (req, res) => ticketHandler.delete(req, res));

export default router;
