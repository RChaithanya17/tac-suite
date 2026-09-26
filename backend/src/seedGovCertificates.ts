import dotenv from "dotenv";
import mongoose from "mongoose";
import GovCertificate from "./models/GovCertificate.js";

dotenv.config();

const seedGovCertificates = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const existingCertificates = await GovCertificate.countDocuments();

    if (existingCertificates > 0) {
      console.log(
        "Government certificates already exist. Nothing to seed."
      );
      return;
    }

    await GovCertificate.insertMany([
      {
        src: "/dpiit.png",
        label: "MSME Registered",
        sub: "Ministry of MSME, Govt. of India",
        order: 1,
      },
      {
        src: "/001.png",
        label: "TAC Certified",
        sub: "Job & Freelance Ready",
        order: 2,
      },
      {
        src: "/msme.png",
        label: "DPIIT Recognised",
        sub: "Startup India, Govt. of India",
        order: 3,
      },
    ]);

    console.log(
      "Government certificates seeded successfully."
    );
  } catch (error) {
    console.error(
      "Government certificates seed error:",
      error
    );
  } finally {
    await mongoose.disconnect();
  }
};

seedGovCertificates();