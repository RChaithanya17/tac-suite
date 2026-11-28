import { Router, Request, Response } from "express";
import StudentWork from "../models/StudentWork.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Accepts a positive whole number; anything else (blank, 0, null) clears it.
const parsePriority = (value: unknown): number | null => {
  const n = Number(value);
  return value !== null && value !== "" && Number.isInteger(n) && n >= 1
    ? n
    : null;
};

// GET all student works
router.get("/", async (_req: Request, res: Response) => {
  try {
    // Three groups: prioritised posters first (priority 1, 2, 3 ...), then
    // all others newest first, then end posters (endOrder 1, 2, 3 ...) last.
    // _id breaks ties so the order never changes between loads.
    const studentWorks = await StudentWork.aggregate([
      {
        $addFields: {
          sortGroup: {
            $cond: [
              { $gte: ["$priority", 1] },
              0,
              { $cond: [{ $gte: ["$endOrder", 1] }, 2, 1] },
            ],
          },
          sortPriority: { $ifNull: ["$priority", 0] },
          sortEnd: { $ifNull: ["$endOrder", 0] },
        },
      },
      { $sort: { sortGroup: 1, sortPriority: 1, sortEnd: 1, createdAt: -1, _id: -1 } },
      { $project: { sortGroup: 0, sortPriority: 0, sortEnd: 0 } },
    ]);

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
      const { image, text, priority, endOrder } = req.body;

      const studentWork = await StudentWork.create({
        image,
        text,
        priority: parsePriority(priority),
        endOrder: parsePriority(endOrder),
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

      // Only touch priority when the request includes it, so older clients
      // that send just image + text never clear an existing priority.
      const update: Record<string, unknown> = { image, text };
      if ("priority" in req.body) update.priority = parsePriority(req.body.priority);
      if ("endOrder" in req.body) update.endOrder = parsePriority(req.body.endOrder);

      const studentWork = await StudentWork.findByIdAndUpdate(
        req.params.id,
        update,
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