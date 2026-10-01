import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import protect, { AuthenticatedRequest } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing from backend/.env",
      });
      return;
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        role: admin.role,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

router.get(
  "/me",
  protect,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const admin = await Admin.findById(req.adminId).select("-password");

      if (!admin) {
        res.status(401).json({
          success: false,
          message: "Admin account no longer exists",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Admin session check error:", error);

      res.status(500).json({
        success: false,
        message: "Session check failed",
      });
    }
  }
);

export default router;