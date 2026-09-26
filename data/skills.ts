import type { LucideIcon } from "lucide-react";
import {
  Video,
  Palette,
  Sparkles,
  Wand2,
  PenTool,
  Camera,
  Handshake,
  Megaphone,
} from "lucide-react";

type Skill = {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tags: string[];
  stat: string;
};

export const skills: Skill[] = [
  {
    id: "01",
    title: "Video Editing",
    desc: "Premiere Pro, narrative cuts, reels.",
    icon: Video,
    tags: ["Premiere", "Reels", "Cuts"],
    stat: "Short-form mastery"
  },
  {
    id: "02",
    title: "Graphic Design",
    desc: "Photoshop, Illustrator, branding.",
    icon: Palette,
    tags: ["Photoshop", "Branding", "Logos"],
    stat: "Visual identity"
  },
  {
    id: "03",
    title: "After Effects",
    desc: "Motion graphics, animations, VFX.",
    icon: Sparkles,
    tags: ["Motion", "VFX", "Animation"],
    stat: "High-end visuals"
  },
  {
    id: "04",
    title: "DaVinci Resolve",
    desc: "Colour grading, cinema outputs.",
    icon: Wand2,
    tags: ["Color", "Cinematic", "LUTs"],
    stat: "Pro grading"
  },
  {
    id: "05",
    title: "Content Writing",
    desc: "Scripts, captions, SEO articles.",
    icon: PenTool,
    tags: ["Scripts", "SEO", "Copy"],
    stat: "Engaging storytelling"
  },
  {
    id: "06",
    title: "Content Shoot",
    desc: "Camera, lighting, direction.",
    icon: Camera,
    tags: ["Camera", "Lighting", "Angles"],
    stat: "Production skills"
  },
  {
    id: "07",
    title: "Client Management",
    desc: "Briefing, revisions, retention.",
    icon: Handshake,
    tags: ["Clients", "Deals", "Retention"],
    stat: "Professional workflow"
  },
  {
    id: "08",
    title: "Digital Marketing",
    desc: "Ads, SEO, analytics, growth.",
    icon: Megaphone,
    tags: ["Ads", "SEO", "Growth"],
    stat: "Revenue focus"
  },
];
