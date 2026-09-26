import { Router, Request, Response } from "express";
import Certificate from "../models/Certificate.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

/**
 * GET /api/certificate
 * Public - Get certificate content
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findOne();

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate content not found",
      });
    }

    return res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificate content",
    });
  }
});

/**
 * POST /api/certificate
 * Admin only - Create certificate content
 *
 * Only one certificate document should exist.
 */
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const existingCertificate = await Certificate.findOne();

      if (existingCertificate) {
        return res.status(409).json({
          success: false,
          message: "Certificate content already exists",
        });
      }

      const certificate = await Certificate.create(req.body);

      return res.status(201).json({
        success: true,
        data: certificate,
      });
    } catch (error) {
      console.error("Create certificate error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create certificate content",
      });
    }
  }
);

/**
 * PUT /api/certificate/:id
 * Admin only - Update certificate content
 */
router.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const certificate = await Certificate.findByIdAndUpdate(
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
          message: "Certificate content not found",
        });
      }

      return res.json({
        success: true,
        data: certificate,
      });
    } catch (error) {
      console.error("Update certificate error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update certificate content",
      });
    }
  }
);

/**
 * DELETE /api/certificate/:id
 * Admin only - Delete certificate content
 */
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const certificate = await Certificate.findByIdAndDelete(
        req.params.id
      );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate content not found",
        });
      }

      return res.json({
        success: true,
        message: "Certificate content deleted successfully",
      });
    } catch (error) {
      console.error("Delete certificate error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete certificate content",
      });
    }
  }
);

export default router;