import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Skill from "./models/Skill.js";
dotenv.config();
const skills = [
  {
    id: "01",
    title: "Graphic Design",
    desc: "Photoshop, Illustrator, branding.",
    icon: "Palette",
    tags: ["Photoshop", "Branding", "Logos"],
    stat: "Visual identity",
    order: 1,
  },
  {
    id: "02",
    title: "Video Editing",
    desc: "Premiere Pro, narrative cuts, reels.",
    icon: "Video",
    tags: ["Premiere", "Reels", "Cuts"],
    stat: "Short-form mastery",
    order: 2,
  },
  {
    id: "03",
    title: "Motion Graphics",
    subtitle: "After Effects",
    desc: "Motion graphics, animations, VFX.",
    icon: "Sparkles",
    tags: ["Motion", "VFX", "Animation"],
    stat: "High-end visuals",
    order: 3,
  },
  {
    id: "04",
    title: "Colour Grading",
    subtitle: "DaVinci Resolve",
    desc: "Colour grading, cinema outputs.",
    icon: "Wand2",
    tags: ["Color", "Cinematic", "LUTs"],
    stat: "Pro grading",
    order: 4,
  },
  {
    id: "05",
    title: "AI Module",
    desc: "Image Generation",
    icon: "ImagePlus",
    tags: [],
    stat: "AI image creation",
    order: 5,
  },
  {
    id: "06",
    title: "AI Module",
    desc: "Video Generation",
    icon: "Clapperboard",
    tags: [],
    stat: "AI video creation",
    order: 6,
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
    console.log(`${skills.length} skills seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed skills:", error);
    process.exit(1);
  }
};
seedSkills();
