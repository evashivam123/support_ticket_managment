import type { Request, Response } from "express";
import { AuthError, authService } from "../application/authService.js";
import { validateLogin, validateSignup } from "../utils/authValidator.js";

export class AuthHandler {
  async signup(req: Request, res: Response) {
    const validation = validateSignup(req);
    if (!validation.valid) return res.status(400).json({ message: validation.error });

    try {
      const { fullName, email, password } = validation.data;
      return res.status(201).json(await authService.signup(fullName, email, password));
    } catch (error) {
      if (error instanceof AuthError) return res.status(error.statusCode).json({ message: error.message });
      if (error instanceof Error && "code" in error && error.code === 11000) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Unable to create account" });
    }
  }

  async login(req: Request, res: Response) {
    const validation = validateLogin(req);
    if (!validation.valid) return res.status(400).json({ message: validation.error });

    try {
      const { email, password } = validation.data;
      return res.json(await authService.login(email, password));
    } catch (error) {
      if (error instanceof AuthError) return res.status(error.statusCode).json({ message: error.message });
      console.error("Login error:", error);
      return res.status(500).json({ message: "Unable to log in" });
    }
  }
}

export const authHandler = new AuthHandler();
