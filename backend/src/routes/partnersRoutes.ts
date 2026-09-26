import { Router } from "express";
import Partners from "../models/Partner.js";
import requireAuth from "../middleware/authMiddleware";

const router = Router();

// Public - get Partners section
router.get("/", async (_req, res) => {
  try {
    const partners = await Partners.findOne();

    res.json({
      success: true,
      data: partners,
    });
  } catch (error) {
    console.error("Failed to fetch partners:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
});

// Admin - create Partners section
router.post("/", requireAuth, async (req, res) => {
  try {
    const existingPartners = await Partners.findOne();

    if (existingPartners) {
      return res.status(409).json({
        success: false,
        message: "Partners already exists. Use PUT to update it.",
      });
    }

    const partners = await Partners.create(req.body);

    res.status(201).json({
      success: true,
      data: partners,
    });
  } catch (error) {
    console.error("Failed to create partners:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create partners",
    });
  }
});

// Admin - update Partners section
router.put("/", requireAuth, async (req, res) => {
  try {
    const partners = await Partners.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!partners) {
      return res.status(404).json({
        success: false,
        message: "Partners not found",
      });
    }

    res.json({
      success: true,
      data: partners,
    });
  } catch (error) {
    console.error("Failed to update partners:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update partners",
    });
  }
});

// Admin - delete Partners section
router.delete("/", requireAuth, async (_req, res) => {
  try {
    const partners = await Partners.findOneAndDelete({});

    if (!partners) {
      return res.status(404).json({
        success: false,
        message: "Partners not found",
      });
    }

    res.json({
      success: true,
      message: "Partners deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete partners:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete partners",
    });
  }
});

export default router;