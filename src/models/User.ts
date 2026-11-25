import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export const USER_ROLES = ["user", "agent", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDocument = HydratedDocument<IUser, UserMethods>;

class UserClass {
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;

  async comparePassword(this: UserDocument, candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const userSchema = new Schema<IUser, Model<IUser, object, UserMethods>, UserMethods>(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: USER_ROLES, default: "user", required: true },
  },
  { timestamps: true },
);

userSchema.loadClass(UserClass);

const User = (mongoose.models.User as Model<IUser, object, UserMethods> | undefined)
  ?? mongoose.model<IUser, Model<IUser, object, UserMethods>>("User", userSchema);

export default User;
