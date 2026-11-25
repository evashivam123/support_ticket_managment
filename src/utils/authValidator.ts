import type { Request } from "express";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupInput = { fullName: string; email: string; password: string };
export type LoginInput = { email: string; password: string };
export type ValidationResult<T> = { valid: true; data: T } | { valid: false; error: string };

export function validateSignup(req: Request): ValidationResult<SignupInput> {
  const { fullName, email, password } = req.body ?? {};

  if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100) {
    return { valid: false, error: "fullName must be between 2 and 100 characters" };
  }
  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return { valid: false, error: "A valid email is required" };
  }
  if (typeof password !== "string" || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  return { valid: true, data: { fullName, email, password } };
}

export function validateLogin(req: Request): ValidationResult<LoginInput> {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || !emailPattern.test(email.trim()) || typeof password !== "string") {
    return { valid: false, error: "A valid email and password are required" };
  }

  return { valid: true, data: { email, password } };
}
