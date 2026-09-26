import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Industry from "./models/Industry.js";

dotenv.config();

const seedIndustries = async (): Promise<void> => {
  try {
    await connectDB();

    const existingIndustries = await Industry.countDocuments();

    if (existingIndustries > 0) {
      console.log(
        `Industries already contain ${existingIndustries} records. Seed cancelled to prevent duplicate records.`
      );
      process.exit(0);
    }

    await Industry.insertMany([
      {
        id: "01",
        title: "Food & Beverage",
        image: "/industries/01.webp",
        order: 1,
      },
      {
        id: "02",
        title: "Fashion & Beauty",
        image: "/industries/02.webp",
        order: 2,
      },
      {
        id: "03",
        title: "Apparel & Lifestyle",
        image: "/industries/03.webp",
        order: 3,
      },
      {
        id: "04",
        title: "Construction & Real Estate",
        image: "/industries/04.webp",
        order: 4,
      },
      {
        id: "05",
        title: "Education & Training",
        image: "/industries/05.webp",
        order: 5,
      },
      {
        id: "06",
        title: "Entertainment & Media",
        image: "/industries/06.webp",
        order: 6,
      },
      {
        id: "07",
        title: "Health & Wellness",
        image: "/industries/07.webp",
        order: 7,
      },
      {
        id: "08",
        title: "Automobiles & Transport",
        image: "/industries/08.webp",
        order: 8,
      },
      {
        id: "09",
        title: "Jewellery & Boutiques",
        image: "/industries/09.webp",
        order: 9,
      },
      {
        id: "10",
        title: "Miscellaneous & Emerging",
        image: "/industries/10.webp",
        order: 10,
      },
    ]);

    console.log("Industries seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Industries seed failed:", error);
    process.exit(1);
  }
};

seedIndustries();