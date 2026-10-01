import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export interface AuthenticatedRequest extends Request {
  adminId?: string;
  role?: string;
}

const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
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

    const decoded = jwt.verify(token, jwtSecret) as {
      adminId: string;
      role: string;
    };

    // Make sure the admin still exists in the database
    const adminExists = await Admin.exists({ _id: decoded.adminId });

    if (!adminExists) {
      res.status(401).json({
        success: false,
        message: "Admin account no longer exists",
      });
      return;
    }

    req.adminId = decoded.adminId;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default protect;