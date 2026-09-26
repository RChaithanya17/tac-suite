import dotenv from "dotenv";
import mongoose from "mongoose";
import PlacementStudent from "../models/PlacementStudent.js";
import PlacementStat from "../models/PlacementStat.js";

dotenv.config();

const topStudents = [
  {
    photo: "/students/1.png",
    name: "Vijay Kumar",
    company: "Nikhila Constructions",
    role: "Video Editor",
    skills: ["Content Shooting", "Video Editing", "Content Writing"],
    lpa: "3.0",
    section: "top",
  },
  {
    photo: "/students/2.png",
    name: "Upendra",
    company: "Alokha Media",
    role: "Video Editor, Graphic Designer",
    skills: ["Content Shooting", "Writing"],
    lpa: "3.0",
    section: "top",
  },
  {
    photo: "/students/3.png",
    name: "Supriya",
    company: "Free Lancer",
    role: "Video Editor",
    skills: ["Graphic Design", "Content Shooting", "Content"],
    section: "top",
  },
  {
    photo: "/students/4.png",
    name: "Shanmukh",
    company: "Freelancer",
    role: "Content Shooting",
    skills: ["Video Editing", "Content Shooting", "Graphic Designing"],
    section: "top",
  },
  {
    photo: "/students/5.png",
    name: "Sandeep",
    company: "Nikhila Constructions",
    role: "Graphic Designer",
    skills: ["Video Editing", "Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "top",
  },
  {
    photo: "/students/6.png",
    name: "Sahil",
    company: "The Art Code",
    role: "Video Editor, Graphic Designer",
    skills: ["Content Shooting", "Content Writing"],
    lpa: "3.2",
    section: "top",
  },
  {
    photo: "/students/7.png",
    name: "Sagar",
    company: "Freelancer",
    role: "Graphic Designer, Video Editor",
    skills: ["Content Shooting", "Video Editing", "Content Writing"],
    section: "top",
  },
  {
    photo: "/students/8.png",
    name: "Manish",
    company: "Bristle Tech",
    role: "Creative Director",
    skills: ["Video Editing", "Graphic Design", "Content Writing"],
    lpa: "4.0",
    section: "top",
  },
  {
    photo: "/students/9-optimized.webp",
    name: "Kiran",
    company: "Freelancer",
    role: "Graphic Designer",
    skills: ["Video Editing", "Content Writing", "Content Shooting"],
    section: "top",
  },
  {
    photo: "/students/10.png",
    name: "Karthik",
    company: "Freelancer",
    role: "Video Editing, Content Shooting",
    skills: ["Graphic Designer", "Content Writing", "Video Editor"],
    section: "top",
  },
  {
    photo: "/students/11.png",
    name: "Jeevan",
    company: "Alokha Media",
    role: "Graphic Designer",
    skills: ["Video Editing", "Content Shooting", "Writing"],
    lpa: "3.0",
    section: "top",
  },
  {
    photo: "/students/25.png",
    name: "Gowtham",
    company: "Rakshan Academy",
    role: "Creative Strategist",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    lpa: "4.8",
    section: "top",
  },
  {
    photo: "/students/26.png",
    name: "Kundhan",
    company: "Reginald Men",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    lpa: "3.6",
    section: "top",
  },
  {
    photo: "/students/28.png",
    name: "Navaneeth",
    company: "Honasa Company",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    lpa: "3.6",
    section: "top",
  },
  {
    photo: "/students/30.png",
    name: "Vishnu",
    company: "The Big Day By CHAI",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "top",
  },
];

const bottomStudents = [
  {
    photo: "/students/12.png",
    name: "Vijay Daniel",
    company: "Jivejar",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shoting", "Content Writing"],
    lpa: "4.0",
    section: "bottom",
  },
  {
    photo: "/students/13.png",
    name: "Balu",
    company: "Geela Creatve Space",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shoting"],
    lpa: "3.0",
    section: "bottom",
  },
  {
    photo: "/students/14.png",
    name: "Anirudh",
    company: "Freelancer",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shoting", "Content Writing"],
    section: "bottom",
  },
  {
    photo: "/students/15.png",
    name: "Anand",
    company: "Freelancer",
    role: "Video Editor, Cinematographer",
    skills: ["Graphic Designing", "Content Shoting", "Content Writing"],
    section: "bottom",
  },
  {
    photo: "/students/16.png",
    name: "Arjun",
    company: "Freelancer",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    section: "bottom",
  },
  {
    photo: "/students/17.png",
    name: "Karthik",
    company: "Ass. Director",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Writing", "Content Shooting"],
    section: "bottom",
  },
  {
    photo: "/students/18.png",
    name: " Rohit",
    company: "Freelancer",
    role: "Video Editor",
    skills: ["Graphic designing", "Content Writing", "Content Shooting"],
    section: "bottom",
  },
  {
    photo: "/students/19-optimized.webp",
    name: "Shiva",
    company: "Freelancer",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Writing", "Content Shooting"],
    section: "bottom",
  },
  {
    photo: "/students/20.png",
    name: "Durgesh",
    company: "Property Edge",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "bottom",
  },
  {
    photo: "/students/21.png",
    name: "Emmanuel",
    company: "Property Edge",
    role: "Video Editor",
    skills: ["Graphic Designing", "Motion Graphic", "Content Shooting"],
    lpa: "4.2",
    section: "bottom",
  },
  {
    photo: "/students/22.png",
    name: "Hemanth",
    company: "Property Edge",
    role: "Video Editor & Graphic Designer",
    skills: ["Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "bottom",
  },
  {
    photo: "/students/23.png",
    name: "Lokesh",
    company: "Citta Ai",
    role: "Graphic Designer",
    skills: ["Graphic Design", "Content Shooting", "Content Writing"],
    lpa: "3.2",
    section: "bottom",
  },
  {
    photo: "/students/24.png",
    name: "Siri",
    company: "Property Edge",
    role: "Graphic Designer",
    skills: ["Video Editing", "Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "bottom",
  },
  {
    photo: "/students/27.png",
    name: "Virajitha",
    company: "Reginald Men",
    role: "Video Editor",
    skills: ["Graphic Designing", "Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "bottom",
  },
  {
    photo: "/students/29-optimized.webp",
    name: "Chandhra Jyothi",
    company: "Dakshin Stories",
    role: "Graphic Designer",
    skills: ["Video Editor", "Content Shooting", "Content Writing"],
    lpa: "3.0",
    section: "bottom",
  },
];

const placementStats = [
  {
    value: "6",
    label: "BATCHES COMPLETED",
  },
  {
    value: "₹30K",
    label: "AVERAGE PACKAGE — FRESHERS",
    highlight: true,
  },
  {
    value: "100%",
    label: "PLACEMENT ASSISTANCE",
  },
  {
    value: "8",
    label: "SKILLS PER STUDENT",
  },
  {
    value: "₹1L",
    label: "MONTH-12 FREELANCE TARGET",
    highlight: true,
  },
  {
    value: "10",
    label: "INDUSTRY PORTFOLIO",
  },
];

const seedPlacements = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected.");

    const studentCount = await PlacementStudent.countDocuments();
    const statCount = await PlacementStat.countDocuments();

    if (studentCount > 0 || statCount > 0) {
      console.log(
        `Placement students already contain ${studentCount} records.`
      );
      console.log(
        `Placement stats already contain ${statCount} records.`
      );
      console.log("Seed cancelled to prevent duplicate records.");

      await mongoose.disconnect();
      return;
    }

    const students = [...topStudents, ...bottomStudents];

    await PlacementStudent.insertMany(students);
    await PlacementStat.insertMany(placementStats);

    console.log(
      `Placement students seeded successfully: ${students.length} records.`
    );

    console.log(
      `Placement stats seeded successfully: ${placementStats.length} records.`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed placements:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedPlacements();