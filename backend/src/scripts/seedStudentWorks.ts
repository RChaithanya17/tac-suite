import dotenv from "dotenv";
import mongoose from "mongoose";
import StudentWork from "../models/StudentWork.js";

dotenv.config();

const studentWorks = [
  { image: "/works/mothish-optimized.webp", text: "PEDDI  POSTER" },
  { image: "/works/nike-from-jpeg.webp", text: "NIKE  POSTER" },
  { image: " /works/biker-optimized.webp", text: "BIKER  POSTER" },
  { image: "/works/Vedam.webp", text: "VEDAM  POSTER" },
  { image: "/works/arjun-optimized.webp", text: "ARJUN REDDY POSTER" },
  { image: "/works/BMW-optimized.webp", text: "BMW POSTER" },
  { image: "/works/PARADISE-optimized.webp", text: "PARADISE POSTER" },
  { image: "/works/DASARA-optimized.webp", text: "DASARA POSTER" },
  { image: "/works/ISLAND-optimized.webp", text: "ISLAND POSTER" },
  { image: "/works/NK-optimized.webp", text: "NUVVE KAVALI POSTER" },
  { image: "/works/NIKE-optimized.webp", text: "NIKE POSTER" },
  { image: "/works/PORSCHE-optimized.webp", text: "PORSCHE POSTER" },
  { image: "/works/JAGUAR-optimized.webp", text: "JAGUAR POSTER" },
  { image: "/works//works/FOOD-optimized.webp", text: "FOOD POSTER 2" },
  { image: "/works/KAADHAL-optimized.webp", text: "KAADHAL POSTER" },
  { image: "/works/GTR-optimized.webp", text: "PORSCHE GTR POSTER" },
  { image: "/works/FOOD1-optimized.webp", text: "FOOD POSTER 1" },
  {
    image: " /works/baahubali-eternal-war.webp",
    text: "BAAHUBALI POSTER",
  },
  { image: "/works/irumudi-2.webp", text: "IRUMUDI POSTER" },
  { image: "/works/rao-bahadur-1.webp", text: "RAO BAHADUR POSTER" },
  { image: "/works/dc.webp", text: "DC POSTER" },
  { image: "/works/panja.webp", text: "PANJA POSTER" },
];

const seedStudentWorks = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected.");

    const existingCount = await StudentWork.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Student Works already contain ${existingCount} records.`
      );
      console.log("Seed cancelled to prevent duplicate records.");

      await mongoose.disconnect();
      return;
    }

    await StudentWork.insertMany(studentWorks);

    console.log(
      `Student Works seeded successfully: ${studentWorks.length} records.`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed Student Works:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedStudentWorks();