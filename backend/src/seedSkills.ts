import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Skill from "./models/Skill.js";
dotenv.config();
const skills = [
  {
    id: "01",
    title: "Video Editing",
    desc: "Premiere Pro, narrative cuts, reels.",
    icon: "Video",
    tags: ["Premiere", "Reels", "Cuts"],
    stat: "Short-form mastery",
  },
  {
    id: "02",
    title: "Graphic Design",
    desc: "Photoshop, Illustrator, branding.",
    icon: "Palette",
    tags: ["Photoshop", "Branding", "Logos"],
    stat: "Visual identity",
  },
  {
    id: "03",
    title: "After Effects",
    desc: "Motion graphics, animations, VFX.",
    icon: "Sparkles",
    tags: ["Motion", "VFX", "Animation"],
    stat: "High-end visuals",
  },
  {
    id: "04",
    title: "DaVinci Resolve",
    desc: "Colour grading, cinema outputs.",
    icon: "Wand2",
    tags: ["Color", "Cinematic", "LUTs"],
    stat: "Pro grading",
  },
  {
    id: "05",
    title: "Content Writing",
    desc: "Scripts, captions, SEO articles.",
    icon: "PenTool",
    tags: ["Scripts", "SEO", "Copy"],
    stat: "Engaging storytelling",
  },
  {
    id: "06",
    title: "Content Shoot",
    desc: "Camera, lighting, direction.",
    icon: "Camera",
    tags: ["Camera", "Lighting", "Angles"],
    stat: "Production skills",
  },
  {
    id: "07",
    title: "Client Management",
    desc: "Briefing, revisions, retention.",
    icon: "Handshake",
    tags: ["Clients", "Deals", "Retention"],
    stat: "Professional workflow",
  },
  {
    id: "08",
    title: "Digital Marketing",
    desc: "Ads, SEO, analytics, growth.",
    icon: "Megaphone",
    tags: ["Ads", "SEO", "Growth"],
    stat: "Revenue focus",
  },
];
const seedSkills = async (): Promise<void> => {
  try {
    await connectDB();
    const existingSkills = await Skill.countDocuments();
    if (existingSkills > 0) {
      console.log(
        `Skills already exist (${existingSkills}). Skipping seed.`
      );
      process.exit(0);
    }
    await Skill.insertMany(skills);
    console.log("8 skills seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed skills:", error);
    process.exit(1);
  }
};
seedSkills();
