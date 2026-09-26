import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Hero from "./models/Hero.js";

dotenv.config();

const seedHero = async (): Promise<void> => {
  try {
    await connectDB();

    const existingHero = await Hero.findOne();

    if (existingHero) {
      console.log("Hero already exists. Seed cancelled to prevent duplicate data.");
      process.exit(0);
    }

    await Hero.create({
      eyebrow: "THE ART CODE — MADHAPUR, HYDERABAD",

      heading: "LEARN",

      highlight: "8 SKILLS.",

      outlineText: "ONE COURSE.",

      description:
        "India's first 8-in-1 creative suite program. Shoot content. Design brands. Edit reels. Land jobs. Crack freelance gigs. Build your ₹1L/month career.",

      ctaText: "ENROLL IN NEXT BATCH",

      videoUrl: "https://youtu.be/Sj5ty8jFp48?si=-toioADM788nzUiY",

      topStripItems: [
        {
          label: "Brand Identity",
          color: "#FFC62A",
          icon: "◈",
          order: 1,
        },
        {
          label: "Logo Design",
          color: "#E8D5A0",
          icon: "⬡",
          order: 2,
        },
        {
          label: "Social Kit",
          color: "#FFC62A",
          icon: "▣",
          order: 3,
        },
        {
          label: "Poster Art",
          color: "#D4B87A",
          icon: "◉",
          order: 4,
        },
        {
          label: "Motion Reel",
          color: "#FFC62A",
          icon: "▷",
          order: 5,
        },
        {
          label: "Color Grade",
          color: "#E8D5A0",
          icon: "◑",
          order: 6,
        },
        {
          label: "Brand Book",
          color: "#FFC62A",
          icon: "◈",
          order: 7,
        },
        {
          label: "Thumbnail Set",
          color: "#D4B87A",
          icon: "▦",
          order: 8,
        },
        {
          label: "Merch Design",
          color: "#FFC62A",
          icon: "⬡",
          order: 9,
        },
        {
          label: "IG Template",
          color: "#E8D5A0",
          icon: "◉",
          order: 10,
        },
      ],

      bottomStripItems: [
        {
          label: "Product Shoot",
          color: "#FFC62A",
          icon: "◎",
          order: 1,
        },
        {
          label: "Reel Edit",
          color: "#E8D5A0",
          icon: "▷",
          order: 2,
        },
        {
          label: "Ad Campaign",
          color: "#FFC62A",
          icon: "◈",
          order: 3,
        },
        {
          label: "Brand Film",
          color: "#D4B87A",
          icon: "◉",
          order: 4,
        },
        {
          label: "Typography Kit",
          color: "#FFC62A",
          icon: "▣",
          order: 5,
        },
        {
          label: "Event Coverage",
          color: "#E8D5A0",
          icon: "◑",
          order: 6,
        },
        {
          label: "Pitch Deck",
          color: "#FFC62A",
          icon: "▦",
          order: 7,
        },
        {
          label: "Photo Edit",
          color: "#D4B87A",
          icon: "⬡",
          order: 8,
        },
        {
          label: "YT Thumbnail",
          color: "#FFC62A",
          icon: "◈",
          order: 9,
        },
        {
          label: "Brand Mockup",
          color: "#E8D5A0",
          icon: "◉",
          order: 10,
        },
      ],

      stats: [
        {
          val: "5",
          label: "Cohorts Done",
          order: 1,
        },
        {
          val: "₹30K",
          label: "Avg Package",
          order: 2,
        },
        {
          val: "10",
          label: "Portfolio",
          order: 3,
        },
        {
          val: "8",
          label: "Skills",
          order: 4,
        },
      ],
    });

    console.log("Hero content seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Hero seed failed:", error);
    process.exit(1);
  }
};

seedHero();