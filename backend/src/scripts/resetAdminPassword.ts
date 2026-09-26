import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

const resetAdminPassword = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected.");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be added to backend/.env"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      console.log("Admin not found.");
    } else {
      console.log("Admin password reset successfully.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to reset admin password:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetAdminPassword();