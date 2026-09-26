import { Router, Request, Response } from "express";
import Tutor from "../models/Tutor.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// GET all tutors
// Public — no login required
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tutors = await Tutor.find().sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      data: tutors,
    });
  } catch (error) {
    console.error("Error fetching tutors:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
    });
  }
});

// GET one tutor
// Public — no login required
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const tutor = await Tutor.findById(req.params.id);

    if (!tutor) {
      res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
      return;
    }

    res.json({
      success: true,
      data: tutor,
    });
  } catch (error) {
    console.error("Error fetching tutor:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor",
    });
  }
});

// CREATE tutor
// Admin only
router.post(
  "/",
  protect,
  async (req: Request, res: Response) => {
    try {
      const { image } = req.body;

      const tutor = await Tutor.create({
        image,
      });

      res.status(201).json({
        success: true,
        message: "Tutor created successfully",
        data: tutor,
      });
    } catch (error) {
      console.error("Error creating tutor:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create tutor",
      });
    }
  }
);

// UPDATE tutor
// Admin only
router.put(
  "/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const { image } = req.body;

      const tutor = await Tutor.findByIdAndUpdate(
        req.params.id,
        {
          image,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!tutor) {
        res.status(404).json({
          success: false,
          message: "Tutor not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Tutor updated successfully",
        data: tutor,
      });
    } catch (error) {
      console.error("Error updating tutor:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update tutor",
      });
    }
  }
);

// DELETE tutor
// Admin only
router.delete(
  "/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const tutor = await Tutor.findByIdAndDelete(
        req.params.id
      );

      if (!tutor) {
        res.status(404).json({
          success: false,
          message: "Tutor not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Tutor deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting tutor:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete tutor",
      });
    }
  }
);

export default router;