import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.model";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      10
    );

    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({
      email: validatedData.email,
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordMatched = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  }
);
export const getMe = asyncHandler(
  async (req: any, res: Response) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);