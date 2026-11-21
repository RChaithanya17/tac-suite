import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Skill from "./models/Skill.js";
dotenv.config();
const skills = [
  {
    id: "01",
    title: "Graphic Design",
    desc: "Posters, social, branding and product design.",
    icon: "Photoshop",
    tags: ["Photoshop", "Firefly", "Posters"],
    stat: "Visual identity",
    track: "Photoshop + AI",
    lessons: [
      "Movie / OTT Poster Design",
      "Social Media Design",
      "YouTube & Content Creator Design",
      "E-commerce & Product Design",
      "Branding & Identity Design",
      "Advanced Photo Manipulation",
      "Print & Marketing Collateral",
    ],
    order: 1,
  },
  {
    id: "02",
    title: "Graphic Design",
    desc: "Vectors, type, packaging and merch.",
    icon: "Palette",
    tags: ["Illustrator", "Vectors", "Logos"],
    stat: "Brand assets",
    track: "Illustrator + AI",
    lessons: [
      "Typography & Font Design",
      "Print & Packaging Design",
      "Social Media & Web Design",
      "Vector & Illustration Design",
      "Merchandise & Product Design",
      "Advanced Vector & Assets",
    ],
    order: 2,
  },
  {
    id: "03",
    title: "Editing",
    desc: "Trailers, weddings, reels and short films.",
    icon: "Video",
    tags: ["Premiere", "Reels", "Cuts"],
    stat: "Short-form mastery",
    track: "Premiere Pro + AI",
    lessons: [
      "Movie Trailer Cuts",
      "Cinematic Wedding Teaser",
      "Beat-Based Editing",
      "Social Media Reels · 10 industries",
      "Complete Short Film Editing",
      "Own Style Editing & Final Touches",
    ],
    order: 3,
  },
  {
    id: "04",
    title: "Motion Graphics",
    desc: "Titles, motion design, animation and VFX.",
    icon: "Sparkles",
    tags: ["Motion", "VFX", "Animation"],
    stat: "High-end visuals",
    track: "After Effects + AI",
    lessons: [
      "Logo & Title Animation",
      "Social Media Motion Graphics",
      "Promo & Explainer Animation",
      "Tracking & Compositing VFX",
      "Character & Product Animation",
      "2D Character Animation",
      "Advanced Motion Graphics",
    ],
    order: 4,
  },
  {
    id: "05",
    title: "Colour Grading",
    desc: "From correction to cinematic looks.",
    icon: "Globe",
    tags: ["Colour", "Cinematic", "LUTs"],
    stat: "Pro grading",
    track: "DaVinci Resolve",
    lessons: [
      "Basic Colour Correction",
      "Cinematic Look Creation",
      "Skin Tone Grading",
      "Commercial Colour Grading",
      "Advanced Professional Grading",
      "Special Effects Grading",
    ],
    order: 5,
  },
  {
    id: "06",
    title: "AI Image Generation",
    desc: "From a single prompt to a realistic visual.",
    icon: "Image",
    tags: ["Prompts", "Upscale", "Characters"],
    stat: "Lock the image first",
    track: "Image",
    lessons: [
      "High-Quality Realistic Visuals",
      "Accurate Facial Details",
      "Cinematic, Professional Lighting",
      "Clean, Balanced Composition",
      "Realistic Depth & Shadows",
      "Premium Visual Aesthetics",
      "Natural Body Proportions",
    ],
    order: 6,
  },
  {
    id: "07",
    title: "AI Video Generation",
    desc: "Turn locked images into cinematic video.",
    icon: "Video",
    tags: ["Higgsfield", "Runway", "Magnific"],
    stat: "Then animate it",
    track: "Higgsfield · Runway · Magnific",
    lessons: [
      "Smooth Cinematic Motion",
      "Realistic Camera Movements",
      "Consistent Visual Quality",
      "Engaging Visual Effects",
      "Transform Ideas into Videos",
      "Quality Video Content",
    ],
    order: 7,
  },
  {
    id: "08",
    title: "AI Workflows",
    desc: "One character, every shot, every tool.",
    icon: "Braces",
    tags: ["Workflows", "JSON", "Consistency"],
    stat: "Direct, don’t just generate",
    track: "JSON + Character Consistency",
    lessons: [
      "Prompt Structure & Shot Language",
      "JSON Prompting",
      "Character Sheet & Locking",
      "Consistent Character Across Shots",
      "Image-to-Video Pipeline",
      "Final AI Film Project",
    ],
    order: 8,
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
