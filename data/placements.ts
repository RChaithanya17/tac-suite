export type PlacementStudent = {
  photo: string;
  name: string;
  company: string;
  role: string;
  skills: string[];
  lpa?: string;
};

export type PlacementStat = {
  value: string;
  label: string;
  highlight?: boolean;
};

export const topStudents: PlacementStudent[] = [
  { photo: "/students/1.png", name: "Vijay Kumar", company: "Nikhila Constructions", role: "Video Editor", skills: ["Content Shooting", "Video Editing", "Content Writing"], lpa: "3.0" },
  { photo: "/students/2.png", name: "Upendra", company: "Alokha Media", role: "Video Editor, Graphic Designer", skills: ["Content Shooting", "Writing"], lpa: "3.0" },
  { photo: "/students/3.png", name: "Supriya", company: "Free Lancer", role: "Video Editor", skills: ["Graphic Design", "Content Shooting", "Content"] },
  { photo: "/students/4.png", name: "Shanmukh", company: "Freelancer", role: "Content Shooting", skills: ["Video Editing", "Content Shooting", "Graphic Designing"] },
  { photo: "/students/5.png", name: "Sandeep", company: "Nikhila Constructions", role: "Graphic Designer", skills: ["Video Editing", "Content Shooting", "Content Writing"], lpa: "3.0" },
  { photo: "/students/6.png", name: "Sahil", company: "The Art Code", role: "Video Editor, Graphic Designer", skills: ["Content Shooting", "Content Writing"], lpa: "3.2" },
  { photo: "/students/7.png", name: "Sagar", company: "Freelancer", role: "Graphic Designer, Video Editor", skills: ["Content Shooting", "Video Editing", "Content Writing"] },
  { photo: "/students/8.png", name: "Manish", company: "Bristle Tech", role: "Creative Director", skills: ["Video Editing", "Graphic Design", "Content Writing"], lpa: "4.0" },
  { photo: "/students/9.png", name: "Kiran", company: "Freelancer", role: "Graphic Designer", skills: ["Video Editing", "Content Writing", "Content Shooting"] },
  { photo: "/students/9-optimized.webp", name: "Karthik", company: "Freelancer", role: "Video Editing, Content Shooting", skills: ["Graphic Designer", "Content Writing", "Video Editor"] },
  { photo: "/students/11.png", name: "Jeevan", company: "Alokha Media", role: "Graphic Designer", skills: ["Video Editing", "Content Shooting", "Writing"], lpa: "3.0" },
  { photo: "/students/25.png", name: "Gowtham", company: "Rakshan Academy", role: "Creative Strategist", skills: ["Graphic Designing", "Content Shooting", "Content Writing"], lpa: "4.8" },
  { photo: "/students/26.png", name: "Kundhan", company: "Reginald Men", role: "Video Editor", skills: ["Graphic Designing", "Content Shooting", "Content Writing"], lpa: "3.6" },
  { photo: "/students/28.png", name: "Navaneeth", company: "Honasa Company", role: "Video Editor", skills: ["Graphic Designing", "Content Shooting", "Content Writing"], lpa: "3.6" },
  { photo: "/students/30.png", name: "Vishnu", company: "The Big Day By CHAI", role: "Video Editor", skills: ["Graphic Designing", "Content Shooting", "Content Writing"], lpa: "3.0" },
];

export const bottomStudents: PlacementStudent[] = [
  { photo: "/students/12.png", name: "Vijay Daniel", company: "Jivejar", role: "Video Editor", skills: ["Graphic Designing", "Content Shoting", "Content Writing"], lpa: "4.0" },
  { photo: "/students/13.png", name: "Balu", company: "Geela Creatve Space", role: "Video Editor", skills: ["Graphic Designing", "Content Shoting"], lpa: "3.0" },
  { photo: "/students/14.png", name: "Anirudh", company: "Freelancer", role: "Video Editor", skills: ["Graphic Designing", "Content Shoting", "Content Writing"] },
  { photo: "/students/15.png", name: "Anand", company: "Freelancer", role: "Video Editor, Cinematographer", skills: ["Graphic Designing", "Content Shoting", "Content Writing"] },
  { photo: "/students/16.png", name: "Arjun", company: "Freelancer", role: "Video Editor", skills: ["Graphic Designing", "Content Shooting", "Content Writing"] },
  { photo: "/students/17.png", name: "Karthik", company: "Ass. Director", role: "Video Editor", skills: ["Graphic Designing", "Content Writing", "Content Shooting"] },
  { photo: "/students/18.png", name: " Rohit", company: "Freelancer", role: "Video Editor", skills: ["Graphic designing", "Content Writing", "Content Shooting"] },
  { photo: "/students/19-optimized.webp", name: "Shiva", company: "Freelancer", role: "Video Editor", skills: ["Graphic Designing", "Content Writing", "Content Shooting"] },
  { photo: "/students/20.png", name: "Durgesh", company: "Property Edge", role: "Video Editor", skills: ["Graphic Designing", "Content Shooting", "Content Writing"], lpa: "3.0" },
  { photo: "/students/21.png", name: "Emmanuel", company: "Property Edge", role: "Video Editor", skills: ["Graphic Designing", "Motion Graphic", "Content Shooting"], lpa: "4.2" },
  { photo: "/students/22.png", name: "Hemanth", company: "Property Edge", role: "Video Editor & Graphic Designer", skills: ["Content Shooting", "Content Writing"], lpa: "3.0" },
  { photo: "/students/23.png", name: "Lokesh", company: "Citta Ai", role: "Graphic Designer", skills: ["Graphic Design", "Content Shooting", "Content Writing"], lpa: "3.2" },
  { photo: "/students/24.png", name: "Siri", company: "Property Edge", role: "Graphic Designer", skills: ["Video Editing", "Content Shooting", "Content Writing"], lpa: "3.0" },
  { photo: "/students/27.png", name: "Virajitha", company: "Reginald Men", role: "Video Editor", skills: ["Graphic Designing", "Content Shooting", "Content Writing"], lpa: "3.0" },
  { photo: "/students/29-optimized.webp", name: "Chandhra Jyothi", company: "Dakshin Stories", role: "Graphic Designer", skills: ["Video Editor", "Content Shooting", "Content Writing"], lpa: "3.0" },
];

export const placementStats: PlacementStat[] = [
  { value: "6", label: "BATCHES COMPLETED" },
  { value: "₹30K", label: "AVERAGE PACKAGE — FRESHERS", highlight: true },
  { value: "100%", label: "PLACEMENT ASSISTANCE" },
  { value: "8", label: "SKILLS PER STUDENT" },
  { value: "₹1L", label: "MONTH-12 FREELANCE TARGET", highlight: true },
  { value: "10", label: "INDUSTRY PORTFOLIO" },
];
