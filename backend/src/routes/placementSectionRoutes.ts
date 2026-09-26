import { Router, Request, Response } from "express";
import PlacementSection from "../models/PlacementSection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// GET — public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const section = await PlacementSection.findOne();

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Placement section content not found",
      });
    }

    return res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error(
      "Get placement section error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch placement section content",
    });
  }
});

// POST — admin only
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const existingSection =
        await PlacementSection.findOne();

      if (existingSection) {
        return res.status(409).json({
          success: false,
          message: "Placement section already exists",
        });
      }

      const section = await PlacementSection.create(
        req.body
      );

      return res.status(201).json({
        success: true,
        data: section,
      });
    } catch (error) {
      console.error(
        "Create placement section error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create placement section",
      });
    }
  }
);

// PUT — admin only
router.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const section =
        await PlacementSection.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Placement section not found",
        });
      }

      return res.json({
        success: true,
        data: section,
      });
    } catch (error) {
      console.error(
        "Update placement section error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update placement section",
      });
    }
  }
);

// DELETE — admin only
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const section =
        await PlacementSection.findByIdAndDelete(
          req.params.id
        );

      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Placement section not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Placement section deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete placement section error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete placement section",
      });
    }
  }
);

export default router;