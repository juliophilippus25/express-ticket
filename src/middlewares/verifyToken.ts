import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { CustomRequest } from "../types/Request";

type JWTPayload = {
  id: string;
};

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined");
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey) as JWTPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Token invalid" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyRole =
  (requiredRole: "admin" | "customer") =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No user data found" });
      }

      if (req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      return next();
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  };
