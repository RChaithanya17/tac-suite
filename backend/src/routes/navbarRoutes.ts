import { Router, Request, Response } from "express";
import Navbar from "../models/Navbar";
import requireAuth from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /api/navbar
 * Public — used by the website Navbar
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const navbar = await Navbar.findOne();

    if (!navbar) {
      return res.status(404).json({
        success: false,
        message: "Navbar content not found",
      });
    }

    return res.json({
      success: true,
      data: navbar,
    });
  } catch (error) {
    console.error("Failed to fetch navbar:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch navbar",
    });
  }
});

/**
 * POST /api/navbar
 * Admin only — create Navbar content
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const existingNavbar = await Navbar.findOne();

    if (existingNavbar) {
      return res.status(409).json({
        success: false,
        message: "Navbar content already exists",
      });
    }

    const navbar = await Navbar.create(req.body);

    return res.status(201).json({
      success: true,
      data: navbar,
    });
  } catch (error) {
    console.error("Failed to create navbar:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create navbar",
    });
  }
});

/**
 * PUT /api/navbar
 * Admin only — update Navbar content
 */
router.put("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const navbar = await Navbar.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    return res.json({
      success: true,
      data: navbar,
    });
  } catch (error) {
    console.error("Failed to update navbar:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update navbar",
    });
  }
});

/**
 * DELETE /api/navbar
 * Admin only — delete Navbar content
 */
router.delete("/", requireAuth, async (_req: Request, res: Response) => {
  try {
    await Navbar.deleteMany({});

    return res.json({
      success: true,
      message: "Navbar content deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete navbar:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete navbar",
    });
  }
});

export default router;