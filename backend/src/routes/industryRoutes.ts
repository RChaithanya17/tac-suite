import { Router, Request, Response } from "express";
import Industry from "../models/Industry.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

/**
 * GET /api/industries
 * Public - Get all industries
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const industries = await Industry.find().sort({ order: 1 });

    return res.json({
      success: true,
      data: industries,
    });
  } catch (error) {
    console.error("Get industries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch industries",
    });
  }
});

/**
 * POST /api/industries
 * Admin only - Create an industry
 */
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const industry = await Industry.create(req.body);

      return res.status(201).json({
        success: true,
        data: industry,
      });
    } catch (error) {
      console.error("Create industry error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create industry",
      });
    }
  }
);

/**
 * PUT /api/industries/:id
 * Admin only - Update an industry
 */
router.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const industry = await Industry.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!industry) {
        return res.status(404).json({
          success: false,
          message: "Industry not found",
        });
      }

      return res.json({
        success: true,
        data: industry,
      });
    } catch (error) {
      console.error("Update industry error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update industry",
      });
    }
  }
);

/**
 * DELETE /api/industries/:id
 * Admin only - Delete an industry
 */
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const industry = await Industry.findByIdAndDelete(req.params.id);

      if (!industry) {
        return res.status(404).json({
          success: false,
          message: "Industry not found",
        });
      }

      return res.json({
        success: true,
        message: "Industry deleted successfully",
      });
    } catch (error) {
      console.error("Delete industry error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete industry",
      });
    }
  }
);

export default router;