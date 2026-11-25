import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRole } from "../models/User.js";
import { userRepository, type UserRepository } from "../infrastructure/userRepository.js";

export class AuthError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthService {
  constructor(private readonly users: UserRepository = userRepository) {}

  async signup(fullName: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.users.existsByEmail(normalizedEmail)) {
      throw new AuthError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.users.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      // Public signup always creates a regular user; role changes belong to an admin flow.
      role: "user",
    });

    return {
      message: "Account created successfully",
      token: this.createToken(user.id, user.role),
      user: this.toPublicUser(user),
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email.trim().toLowerCase(), true);
    if (!user || !(await user.comparePassword(password))) {
      throw new AuthError("Invalid email or password", 401);
    }

    return {
      message: "Login successful",
      token: this.createToken(user.id, user.role),
      user: this.toPublicUser(user),
    };
  }

  private createToken(userId: string, role: UserRole) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is required in the environment");
    return jwt.sign({ sub: userId, role }, secret, { expiresIn: "1d" });
  }

  private toPublicUser(user: { id: string; fullName: string; email: string; role: UserRole }) {
    return { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
  }
}

export const authService = new AuthService();
