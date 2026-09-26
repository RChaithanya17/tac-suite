import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import courseRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentWorkRoutes from "./routes/studentWorkRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import govCertificateRoutes from "./routes/govCertificateRoutes.js";
import placementSectionRoutes from "./routes/placementSectionRoutes.js"
import footerRoutes from "./routes/footerRoutes.js";
import navbarRoutes from "./routes/navbarRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import partnersRoutes from "./routes/partnersRoutes.js";
import studentWorksSettingsRoutes from "./routes/studentWorksSettingsRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "TAC backend is running",
  });
});
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student-works", studentWorkRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/gov-certificates", govCertificateRoutes);
app.use("/api/placement-section", placementSectionRoutes);
app.use("/api/footer",footerRoutes);
app.use("/api/navbar", navbarRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/student-works-settings", studentWorksSettingsRoutes);
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `TAC backend running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
