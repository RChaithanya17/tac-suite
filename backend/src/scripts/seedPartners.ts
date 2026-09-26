import dotenv from "dotenv";
import connectDB from "../config/db";
import Partners from "../models/Partner";

dotenv.config();

const seedPartners = async () => {
  try {
    await connectDB();

    const existingPartners = await Partners.findOne();

    if (existingPartners) {
      console.log("Partners already exists. Skipping seed.");
      process.exit(0);
    }

    await Partners.create({
      heading: "Associated Studios, Agencies & Hiring Partners",
      partners: [
        { name: "BRANDLABS" },
        { name: "CREATIVE CO." },
        { name: "STUDIO 91" },
        { name: "ADGENCE HYD" },
        { name: "SOCIAL PULSE" },
        { name: "REELCRAFT" },
        { name: "VIJAYIISAM" },
        { name: "PIXEL WORKS" },
        { name: "THINKMEDIA" },
        { name: "REDANTZ" },
        { name: "TAMMADA MEDIA" },
        { name: "PROPERTY EDGE" },
        { name: "ALOK MEDIA" },
        { name: "CITTA AI" },
        { name: "INFINITUM" },
        { name: "HYD TALKIES" },
        { name: "WE MEDIA" },
        { name: "STUDENT TRIBE" },
        { name: "RECORD INNOVATION" },
        { name: "DOLLY STUDIOS" },
      ],
    });

    console.log("Partners seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed Partners:", error);
    process.exit(1);
  }
};

seedPartners();