import { Router, Request, Response } from "express";
import GovCertificate from "../models/GovCertificate.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// GET — public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const certificates = await GovCertificate.find().sort({
      order: 1,
    });

    return res.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error(
      "Get government certificates error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch government certificates",
    });
  }
});

// POST — admin only
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const certificate = await GovCertificate.create(
        req.body
      );

      return res.status(201).json({
        success: true,
        data: certificate,
      });
    } catch (error) {
      console.error(
        "Create government certificate error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create government certificate",
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
      const certificate =
        await GovCertificate.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Government certificate not found",
        });
      }

      return res.json({
        success: true,
        data: certificate,
      });
    } catch (error) {
      console.error(
        "Update government certificate error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update government certificate",
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
      const certificate =
        await GovCertificate.findByIdAndDelete(
          req.params.id
        );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Government certificate not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Government certificate deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete government certificate error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete government certificate",
      });
    }
  }
);

export default router;