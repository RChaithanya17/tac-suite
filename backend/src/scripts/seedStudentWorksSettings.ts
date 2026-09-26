import dotenv from "dotenv";
import connectDB from "../config/db";
import StudentWorksSettings from "../models/StudentWorksSettings";

dotenv.config();

const seedStudentWorksSettings = async () => {
  try {
    await connectDB();

    const existingSettings =
      await StudentWorksSettings.findOne();

    if (existingSettings) {
      console.log(
        "Student Works settings already exist. Skipping seed."
      );
      process.exit(0);
    }

    await StudentWorksSettings.create({
      heading: "STUDENT WORKS",
      description: "Recreated By Our Students",
      buttonText: "VIEW STUDENT PORTFOLIO",
      portfolioUrl: "https://tac-portfolio.vercel.app/",
    });

    console.log(
      "Student Works settings seeded successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed Student Works settings:",
      error
    );

    process.exit(1);
  }
};

seedStudentWorksSettings();