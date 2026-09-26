import dotenv from "dotenv";
import connectDB from "../config/db";
import Navbar from "../models/Navbar";

dotenv.config();

const seedNavbar = async () => {
  try {
    await connectDB();

    const existingNavbar = await Navbar.findOne();

    if (existingNavbar) {
      console.log("Navbar already exists. Skipping seed.");
      process.exit(0);
    }

    await Navbar.create({
      announcement: "BATCH 10 • ENROLLMENTS OPEN",

      navigationLinks: [
        {
          label: "Skills",
          href: "/#skills",
        },
        {
          label: "Portfolio",
          href: "/#student-works",
        },
        {
          label: "Placements",
          href: "/#placements",
        },
        {
          label: "Cohorts",
          href: "/#courses",
        },
      ],
    });

    console.log("Navbar seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed Navbar:", error);
    process.exit(1);
  }
};

seedNavbar();