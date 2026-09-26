import dotenv from "dotenv";
import mongoose from "mongoose";
import Footer from "./models/Footer.js";

dotenv.config();

const seedFooter = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const existingFooter = await Footer.findOne();

    if (existingFooter) {
      console.log("Footer already exists. Nothing to seed.");
      return;
    }

    await Footer.create({
      socialLinks: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/tac_theartcode?igsh=dTk2NGpvb2ZoZmVx",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/company/tac-the-art-code/",
        },
        {
          label: "YouTube",
          href: "https://www.youtube.com/@the_artcode",
        },
      ],

      footerContact: {
        addressLines: [
          "4th Floor,",
          "Plot No. 286, Road No 16,",
          "Ayyappa Society Main Rd",
          "Madhapur, Telangana 500081",
        ],
        phone: "+91 9966 430 431",
        phoneHref: "tel:+919966430431",
        admissionsEmail: "admissions@theartcode.org",
        admissionsEmailHref: "mailto:admissions@theartcode.org",
      },

      courseAboutLinks: [
        {
          label: "Courses",
          href: "/courses",
        },
        {
          label: "About Us",
          href: "/about",
        },
      ],

      legalLinks: [
        {
          label: "Terms & Conditions",
          href: "/terms-and-conditions",
        },
        {
          label: "Privacy Policy",
          href: "/privacy-policy",
        },
        {
          label: "Refund & Cancellation",
          href: "/refund-policy",
        },
        {
          label: "Payment Terms",
          href: "/payment-terms",
        },
      ],

      footerBadges: [
        {
          label: "DPIIT Recognised",
        },
        {
          label: "NSDC Affiliated",
        },
        {
          label: "Skill India Certified",
        },
      ],

      copyright:
        "© 2025 TAC School of Modern Learning Pvt. Ltd.",

      marketingStatement:
        "Building creators into professionals — portfolio, job & freelance ready.",
    });

    console.log("Footer seeded successfully.");
  } catch (error) {
    console.error("Footer seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedFooter();