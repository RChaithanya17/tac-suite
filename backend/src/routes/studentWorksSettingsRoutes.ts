import { Router } from "express";
import StudentWorksSettings from "../models/StudentWorksSettings.js";
import requireAuth from "../middleware/authMiddleware";

const router = Router();

// Public - get Student Works section settings
router.get("/", async (_req, res) => {
  try {
    const settings = await StudentWorksSettings.findOne();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to fetch Student Works settings:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Student Works settings",
    });
  }
});

// Admin - create Student Works settings
router.post("/", requireAuth, async (req, res) => {
  try {
    const existingSettings = await StudentWorksSettings.findOne();

    if (existingSettings) {
      return res.status(409).json({
        success: false,
        message:
          "Student Works settings already exist. Use PUT to update them.",
      });
    }

    const settings = await StudentWorksSettings.create(req.body);

    res.status(201).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to create Student Works settings:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create Student Works settings",
    });
  }
});

// Admin - update Student Works settings
router.put("/", requireAuth, async (req, res) => {
  try {
    const settings =
      await StudentWorksSettings.findOneAndUpdate(
        {},
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Student Works settings not found",
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Failed to update Student Works settings:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update Student Works settings",
    });
  }
});

// Admin - delete Student Works settings
router.delete("/", requireAuth, async (_req, res) => {
  try {
    const settings =
      await StudentWorksSettings.findOneAndDelete({});

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Student Works settings not found",
      });
    }

    res.json({
      success: true,
      message: "Student Works settings deleted successfully",
    });
  } catch (error) {
    console.error(
      "Failed to delete Student Works settings:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete Student Works settings",
    });
  }
});

export default router;