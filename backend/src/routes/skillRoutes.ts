import { Router, Request, Response } from "express";
import Skill from "../models/Skill.js";
import protect from "../middleware/authMiddleware.js";
const router = Router();
// Get all skills
router.get("/", async (_req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
});
// Get one skill by MongoDB ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }
    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Error fetching skill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
});
// Create skill
router.post("/", protect, async (req: Request, res: Response) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create skill",
    });
  }
});
// Update skill
router.put("/:id", protect, async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }
    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update skill",
    });
  }
});
// Delete skill
router.delete("/:id", protect, async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }
    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
});
export default router;
