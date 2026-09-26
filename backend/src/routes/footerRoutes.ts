import { Router, Request, Response } from "express";
import Footer from "../models/Footer.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// GET — public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const footer = await Footer.findOne();

    if (!footer) {
      return res.status(404).json({
        success: false,
        message: "Footer content not found",
      });
    }

    return res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error("Get footer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer content",
    });
  }
});

// POST — admin only
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const existingFooter = await Footer.findOne();

      if (existingFooter) {
        return res.status(409).json({
          success: false,
          message: "Footer already exists",
        });
      }

      const footer = await Footer.create(req.body);

      return res.status(201).json({
        success: true,
        data: footer,
      });
    } catch (error) {
      console.error("Create footer error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create footer",
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
      const footer = await Footer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!footer) {
        return res.status(404).json({
          success: false,
          message: "Footer not found",
        });
      }

      return res.json({
        success: true,
        data: footer,
      });
    } catch (error) {
      console.error("Update footer error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update footer",
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
      const footer = await Footer.findByIdAndDelete(
        req.params.id
      );

      if (!footer) {
        return res.status(404).json({
          success: false,
          message: "Footer not found",
        });
      }

      return res.json({
        success: true,
        message: "Footer deleted successfully",
      });
    } catch (error) {
      console.error("Delete footer error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete footer",
      });
    }
  }
);

export default router;