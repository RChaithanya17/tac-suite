import { Router } from "express";
import Challenge from "../models/Challenge.js";
import requireAuth from "../middleware/authMiddleware";

const router = Router();

// GET — Public
router.get("/", async (_req, res) => {
  try {
    const challenge = await Challenge.findOne();

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error("Failed to fetch challenge:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch challenge",
    });
  }
});

// POST — Admin
router.post("/", requireAuth, async (req, res) => {
  try {
    const existingChallenge = await Challenge.findOne();

    if (existingChallenge) {
      return res.status(409).json({
        success: false,
        message: "Challenge already exists. Use PUT to update it.",
      });
    }

    const challenge = await Challenge.create(req.body);

    res.status(201).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error("Failed to create challenge:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create challenge",
    });
  }
});

// PUT — Admin
router.put("/", requireAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error("Failed to update challenge:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update challenge",
    });
  }
});

// DELETE — Admin
router.delete("/", requireAuth, async (_req, res) => {
  try {
    const challenge = await Challenge.findOneAndDelete({});

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete challenge:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete challenge",
    });
  }
});

export default router;