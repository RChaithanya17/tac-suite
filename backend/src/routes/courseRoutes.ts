import { Router, Request, Response } from "express";
import Course from "../models/Course.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// GET all courses
// Public — no login required
router.get("/", async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
});

// GET one course
// Public — no login required
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
});

// CREATE course
// Admin only
router.post("/", protect, async (req: Request, res: Response) => {
  try {
    const { title, description, image, status } = req.body;

    const course = await Course.create({
      title,
      description,
      image,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
});

// UPDATE course
// Admin only
router.put("/:id", protect, async (req: Request, res: Response) => {
  try {
    const { title, description, image, status } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
});

// DELETE course
// Admin only
router.delete("/:id", protect, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
});

export default router;