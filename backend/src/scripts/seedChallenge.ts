import dotenv from "dotenv";
import connectDB from "../config/db";
import Challenge from "../models/Challenge";

dotenv.config();

const seedChallenge = async () => {
  try {
    await connectDB();

    const existingChallenge = await Challenge.findOne();

    if (existingChallenge) {
      console.log("Challenge already exists. Skipping seed.");
      process.exit(0);
    }

    await Challenge.create({
      eyebrow: "06 / The Challenge",
      heading: "₹1 LAKH\nCHALLENGE",
      description:
        "After month 12, our students hit ₹1 lakh/month. Not a promise — a system. Portfolio → Job → Freelance gigs → Repeat clients → Scale.",
      buttonText: "Join The Challenge",
      steps: [
        {
          num: "01",
          title: "Build the Portfolio",
          desc: "10 industries. Real shoots. Real design. Certificate earned.",
        },
        {
          num: "02",
          title: "Crack the Job",
          desc: "₹25K–₹30K first job. LinkedIn active. IG content portfolio live.",
        },
        {
          num: "03",
          title: "Get Freelance Gigs",
          desc: "Parallel income from month one. 3–5 clients by month 6.",
        },
        {
          num: "04",
          title: "Hit ₹1L / Month",
          desc: "Salary + freelance = ₹1 lakh. Month 12 is the target.",
        },
      ],
    });

    console.log("Challenge seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed Challenge:", error);
    process.exit(1);
  }
};

seedChallenge();