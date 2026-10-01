import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { ask, MIN_PASSWORD_LENGTH } from "./prompt.js";

dotenv.config();

const resetAdminPassword = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected.");

    const email = (await ask("Admin email: ")).toLowerCase();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const password = await ask("New password: ", true);

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );
    }

    const confirmPassword = await ask("Confirm password: ", true);

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    admin.password = await bcrypt.hash(password, 12);
    await admin.save();

    console.log("Admin password reset successfully.");

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "Failed to reset admin password:",
      error instanceof Error ? error.message : error
    );
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetAdminPassword();
