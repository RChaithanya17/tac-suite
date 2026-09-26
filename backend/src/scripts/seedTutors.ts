import dotenv from "dotenv";
import mongoose from "mongoose";
import Tutor from "../models/Tutor.js";

dotenv.config();

const tutors = [
  { image: "/tutors/tutor1-optimized.webp" },
  { image: "/tutors/tutor2-optimized.webp" },
  { image: "/tutors/tutor3-optimized.webp" },
  { image: "/tutors/tutor4-optimized.webp" },
  { image: "/tutors/tutor5-optimized.webp" },
  { image: "/tutors/tutor6-optimized.webp" },
  { image: "/tutors/tutor8-optimized.webp" },
];

const seedTutors = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected.");

    const existingCount = await Tutor.countDocuments();

    if (existingCount > 0) {
      console.log(`Tutors already contain ${existingCount} records.`);
      console.log("Seed cancelled to prevent duplicate records.");

      await mongoose.disconnect();
      return;
    }

    await Tutor.insertMany(tutors);

    console.log(`Tutors seeded successfully: ${tutors.length} records.`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed tutors:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedTutors();