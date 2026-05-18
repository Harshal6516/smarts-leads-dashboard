import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.model";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(
  async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Not authorized", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = user;

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        "You are not allowed to access this resource",
        403
      );
    }

    next();
  };
};