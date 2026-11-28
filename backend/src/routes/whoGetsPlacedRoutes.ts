import { Router, Request, Response } from "express";
import WhoGetsPlaced from "../models/WhoGetsPlaced.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

/* Only these fields can be saved from the admin panel. */
function pickContent(body: Record<string, unknown>) {
  const fields = [
    "eyebrow",
    "heading",
    "movieLabel",
    "logo",
    "logoAlt",
    "movieParagraphs",
    "sectorsEyebrow",
    "companiesHeading",
    "sectors",
    "callout",
  ];
  const content: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in body) content[field] = body[field];
  }
  return content;
}

// GET — public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const section = await WhoGetsPlaced.findOne();

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Failed to fetch Who Gets Placed section:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Who Gets Placed section",
    });
  }
});

// PUT — admin only. Updates the single document, creating it if missing.
router.put("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const section = await WhoGetsPlaced.findOneAndUpdate(
      {},
      pickContent(req.body ?? {}),
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Failed to update Who Gets Placed section:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update Who Gets Placed section",
    });
  }
});

export default router;
