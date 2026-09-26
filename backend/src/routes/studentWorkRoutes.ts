import { Router, Request, Response } from "express";
import StudentWork from "../models/StudentWork.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// GET all student works
router.get("/", async (_req: Request, res: Response) => {
  try {
    const studentWorks = await StudentWork.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: studentWorks,
    });
  } catch (error) {
    console.error("Error fetching student works:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student works",
    });
  }
});

// GET one student work
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const studentWork = await StudentWork.findById(req.params.id);

    if (!studentWork) {
      res.status(404).json({
        success: false,
        message: "Student work not found",
      });
      return;
    }

    res.json({
      success: true,
      data: studentWork,
    });
  } catch (error) {
    console.error("Error fetching student work:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student work",
    });
  }
});

// CREATE student work - Admin only
router.post(
  "/",
  protect,
  async (req: Request, res: Response) => {
    try {
      const { image, text } = req.body;

      const studentWork = await StudentWork.create({
        image,
        text,
      });

      res.status(201).json({
        success: true,
        message: "Student work created successfully",
        data: studentWork,
      });
    } catch (error) {
      console.error("Error creating student work:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create student work",
      });
    }
  }
);

// UPDATE student work - Admin only
router.put(
  "/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const { image, text } = req.body;

      const studentWork = await StudentWork.findByIdAndUpdate(
        req.params.id,
        {
          image,
          text,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!studentWork) {
        res.status(404).json({
          success: false,
          message: "Student work not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Student work updated successfully",
        data: studentWork,
      });
    } catch (error) {
      console.error("Error updating student work:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update student work",
      });
    }
  }
);

// DELETE student work - Admin only
router.delete(
  "/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const studentWork = await StudentWork.findByIdAndDelete(
        req.params.id
      );

      if (!studentWork) {
        res.status(404).json({
          success: false,
          message: "Student work not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Student work deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting student work:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete student work",
      });
    }
  }
);

export default router;