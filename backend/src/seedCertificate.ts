import dotenv from "dotenv";
import mongoose from "mongoose";
import Certificate from "./models/Certificate.js";

dotenv.config();

const seedCertificate = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const existingCertificate = await Certificate.findOne();

    if (existingCertificate) {
      console.log("Certificate already exists. Nothing to seed.");
      return;
    }

    await Certificate.create({
      heading: "JOB & FREELANCE READY CERTIFICATE",

      description:
        "India's first certificate that proves you can shoot, design, and market — across all industries, verified.",

      issuerName: "THE ART CODE — TAC",

      certificateSubtitle:
        "Certificate of Job & Freelance Readiness",

      certificateDescription:
        "This certifies that the holder has successfully completed the TAC Suite program, demonstrating mastery across creative disciplines and building a verified industry portfolio.",

      issuedBy: "THE ART CODE",

      recognition: "NSDC / Skill India",

      status: "DPIIT Recognised",

      certificateImage: "/certificate.webp",

      badgeText:
        "★ India's First 10-Industry Portfolio Certificate",

      features: [
        {
          title:
            "Real Work. Real Portfolio. Not Just a Certificate.",
          desc:
            "Employers hire portfolios, not degrees every skill you learn is applied on live brand briefs.",
        },
        {
          title:
            "Job-Ready in 90 Days Not 2 Years.",
          desc:
            "No MBA wait, no extra years placed, promoted, or freelancing within 90 days of completion.",
        },
        {
          title:
            "Freelance Income Starts Before You Even Graduate.",
          desc:
            "You learn to take on paying clients and manage projects so your income starts during the course.",
        },
        {
          title:
            "Industry-Validated. Employer-Recognised.",
          desc:
            "Your skills are verified by the companies that will hire you not just the institution that taught you.",
        },
        {
          title:
            "You're Not Just Certified You're Hireable.",
          desc:
            "Built around skills companies are actively hiring for this credential opens doors, not just fills a resume.",
        },
      ],

      packageText:
        "₹25K–₹40K Avg First Job Package",

      packageDescription:
        "Freshers placed across Hyderabad, AP & remote roles.",
    });

    console.log("Certificate seeded successfully.");
  } catch (error) {
    console.error("Certificate seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedCertificate();