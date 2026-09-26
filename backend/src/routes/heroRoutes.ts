import { Router, Request, Response } from "express";
import Hero from "../models/Hero.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

/*
 * GET /api/hero
 * Public — used by the TAC website
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const hero = await Hero.findOne();

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero content not found",
      });
    }

    return res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error("Get hero error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hero content",
    });
  }
});

/*
 * POST /api/hero
 * Admin only — creates the Hero document
 */
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const existingHero = await Hero.findOne();

      if (existingHero) {
        return res.status(409).json({
          success: false,
          message: "Hero content already exists",
        });
      }

      const hero = await Hero.create(req.body);

      return res.status(201).json({
        success: true,
        data: hero,
      });
    } catch (error) {
      console.error("Create hero error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create hero content",
      });
    }
  }
);

/*
 * PUT /api/hero/:id
 * Admin only — updates the Hero document
 */
router.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const hero = await Hero.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!hero) {
        return res.status(404).json({
          success: false,
          message: "Hero content not found",
        });
      }

      return res.json({
        success: true,
        data: hero,
      });
    } catch (error) {
      console.error("Update hero error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update hero content",
      });
    }
  }
);

/*
 * DELETE /api/hero/:id
 * Admin only — removes the Hero document
 */
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const hero = await Hero.findByIdAndDelete(req.params.id);

      if (!hero) {
        return res.status(404).json({
          success: false,
          message: "Hero content not found",
        });
      }

      return res.json({
        success: true,
        message: "Hero content deleted successfully",
      });
    } catch (error) {
      console.error("Delete hero error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete hero content",
      });
    }
  }
);

export default router;