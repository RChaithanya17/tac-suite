import dotenv from "dotenv";
import mongoose from "mongoose";
import PlacementSection from "./models/PlacementSection.js";

dotenv.config();

const seedPlacementSection = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const existingSection = await PlacementSection.findOne();

    if (existingSection) {
      console.log(
        "Placement section already exists. Nothing to seed."
      );
      return;
    }

    await PlacementSection.create({
      eyebrow: "★ FIRST REAL PLACEMENT CERTIFICATE",

      heading: "REAL JOBS.\nREAL MONEY.",

      description:
        "Numbers from Cohort 1 and 2. Both cohorts placed successfully within 60 days of completion.",
    });

    console.log(
      "Placement section seeded successfully."
    );
  } catch (error) {
    console.error(
      "Placement section seed error:",
      error
    );
  } finally {
    await mongoose.disconnect();
  }
};

seedPlacementSection();