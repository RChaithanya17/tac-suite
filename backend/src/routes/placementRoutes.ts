import { Router, Request, Response } from "express";
import PlacementStudent from "../models/PlacementStudent.js";
import PlacementStat from "../models/PlacementStat.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

/* Positive whole numbers only; anything else (blank, 0, text) clears it. */
function parseOrder(value: unknown): number | null {
  const n = Number(value);
  return value !== null && value !== "" && Number.isInteger(n) && n >= 1
    ? n
    : null;
}

/* =========================================================
   STUDENTS
========================================================= */

// GET all placement students - public
router.get("/students", async (_req: Request, res: Response) => {
  try {
    // Ordered students first (order 1, 2, 3 ...), then the rest oldest first;
    // _id breaks ties so the order never changes between loads.
    const students = await PlacementStudent.aggregate([
      {
        $addFields: {
          sortOrder: { $ifNull: ["$order", Number.MAX_SAFE_INTEGER] },
        },
      },
      { $sort: { sortOrder: 1, createdAt: 1, _id: 1 } },
      { $project: { sortOrder: 0 } },
    ]);

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching placement students:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement students",
    });
  }
});

// GET one placement student - public
router.get("/students/:id", async (req: Request, res: Response) => {
  try {
    const student = await PlacementStudent.findById(req.params.id);

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Placement student not found",
      });
      return;
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching placement student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement student",
    });
  }
});

// CREATE placement student - admin only
router.post(
  "/students",
  protect,
  async (req: Request, res: Response) => {
    try {
      const {
        photo,
        name,
        company,
        role,
        skills,
        lpa,
        section,
        order,
      } = req.body;

      const student = await PlacementStudent.create({
        photo,
        name,
        company,
        role,
        skills,
        lpa,
        section,
        order: parseOrder(order),
      });

      res.status(201).json({
        success: true,
        message: "Placement student created successfully",
        data: student,
      });
    } catch (error) {
      console.error("Error creating placement student:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create placement student",
      });
    }
  }
);

// UPDATE placement student - admin only
router.put(
  "/students/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const {
        photo,
        name,
        company,
        role,
        skills,
        lpa,
        section,
      } = req.body;

      const update: Record<string, unknown> = {
        photo,
        name,
        company,
        role,
        skills,
        lpa,
        section,
      };

      // Only touch the order when the admin form sends it.
      if ("order" in req.body) update.order = parseOrder(req.body.order);

      const student = await PlacementStudent.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!student) {
        res.status(404).json({
          success: false,
          message: "Placement student not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Placement student updated successfully",
        data: student,
      });
    } catch (error) {
      console.error("Error updating placement student:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update placement student",
      });
    }
  }
);

// DELETE placement student - admin only
router.delete(
  "/students/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const student = await PlacementStudent.findByIdAndDelete(
        req.params.id
      );

      if (!student) {
        res.status(404).json({
          success: false,
          message: "Placement student not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Placement student deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting placement student:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete placement student",
      });
    }
  }
);

/* =========================================================
   STATS
========================================================= */

// GET all placement stats - public
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await PlacementStat.find().sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching placement stats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement stats",
    });
  }
});

// GET one placement stat - public
router.get("/stats/:id", async (req: Request, res: Response) => {
  try {
    const stat = await PlacementStat.findById(req.params.id);

    if (!stat) {
      res.status(404).json({
        success: false,
        message: "Placement stat not found",
      });
      return;
    }

    res.json({
      success: true,
      data: stat,
    });
  } catch (error) {
    console.error("Error fetching placement stat:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement stat",
    });
  }
});

// CREATE placement stat - admin only
router.post(
  "/stats",
  protect,
  async (req: Request, res: Response) => {
    try {
      const { value, label, highlight } = req.body;

      const stat = await PlacementStat.create({
        value,
        label,
        highlight,
      });

      res.status(201).json({
        success: true,
        message: "Placement stat created successfully",
        data: stat,
      });
    } catch (error) {
      console.error("Error creating placement stat:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create placement stat",
      });
    }
  }
);

// UPDATE placement stat - admin only
router.put(
  "/stats/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const { value, label, highlight } = req.body;

      const stat = await PlacementStat.findByIdAndUpdate(
        req.params.id,
        {
          value,
          label,
          highlight,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!stat) {
        res.status(404).json({
          success: false,
          message: "Placement stat not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Placement stat updated successfully",
        data: stat,
      });
    } catch (error) {
      console.error("Error updating placement stat:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update placement stat",
      });
    }
  }
);

// DELETE placement stat - admin only
router.delete(
  "/stats/:id",
  protect,
  async (req: Request, res: Response) => {
    try {
      const stat = await PlacementStat.findByIdAndDelete(
        req.params.id
      );

      if (!stat) {
        res.status(404).json({
          success: false,
          message: "Placement stat not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Placement stat deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting placement stat:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete placement stat",
      });
    }
  }
);

export default router;