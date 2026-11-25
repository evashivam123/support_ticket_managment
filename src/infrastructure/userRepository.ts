import User, { type IUser, type UserRole } from "../models/User.js";

export type NewUser = Pick<IUser, "fullName" | "email" | "password" | "role">;

export class UserRepository {
  findByEmail(email: string, includePassword = false) {
    const query = User.findOne({ email });
    return includePassword ? query.select("+password") : query;
  }

  existsByEmail(email: string) {
    return User.exists({ email });
  }

  create(user: NewUser) {
    return User.create(user);
  }
}

export const userRepository = new UserRepository();
