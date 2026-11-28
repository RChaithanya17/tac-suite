import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db";
import WhoGetsPlaced from "../models/WhoGetsPlaced";

dotenv.config();

export const whoGetsPlacedContent = {
  eyebrow: "From film sets to agencies",
  heading: "Who gets placed - and where?",
  movieLabel: "Movie Industry",
  logo: "/companies/walls-and-trends.webp",
  logoAlt: "Walls & Trends",
  movieParagraphs: [
    "Posters and pre-production for **Netflix** and **Warner Bros.** projects.",
    "Trailer cuts and lyrical videos for **Baahubali, RRR** and top‑star films.",
  ],
  sectorsEyebrow: "And across every other sector",
  companiesHeading: "40+ companies",
  sectors: [
    { count: "15", label: "Media, creative and marketing", color: "#FE5517" },
    { count: "11", label: "AI and tech", color: "#346CDD" },
    { count: "6", label: "Consumer brands", color: "#987050" },
    { count: "4", label: "Real estate", color: "#3C3C47" },
    { count: "6", label: "Education and services", color: "#CAA021" },
  ],
  callout: "From Batch 1: a TAC student now works as Assistant Director.",
};

const seedWhoGetsPlaced = async () => {
  try {
    await connectDB();

    if (await WhoGetsPlaced.findOne()) {
      console.log("Who Gets Placed section already exists. Skipping seed.");
    } else {
      await WhoGetsPlaced.create(whoGetsPlacedContent);
      console.log("Who Gets Placed section seeded successfully.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed Who Gets Placed section:", error);
    process.exit(1);
  }
};

seedWhoGetsPlaced();
