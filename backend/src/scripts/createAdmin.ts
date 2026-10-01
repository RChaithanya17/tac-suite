import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { ask, isValidEmail, MIN_PASSWORD_LENGTH } from "./prompt.js";

dotenv.config();

const createAdmin = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected.");

    const name = (await ask("Admin name (TAC Admin): ")) || "TAC Admin";
    const email = (await ask("Admin email: ")).toLowerCase();

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      throw new Error(
        "An admin with this email already exists. Use npm run reset-admin-password to change its password."
      );
    }

    const password = await ask("Admin password: ", true);

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );
    }

    const confirmPassword = await ask("Confirm password: ", true);

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      email,
      password: hashedPassword,
      name,
      role: "admin",
    });

    console.log(`Admin ${email} created successfully.`);

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "Failed to create admin:",
      error instanceof Error ? error.message : error
    );
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
