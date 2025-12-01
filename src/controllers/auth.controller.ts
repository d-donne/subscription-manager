import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../database/models/user.model";
import { AppError } from "../middlewares/error.middleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
import ms from "ms";

export const handleSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;
    console.log("Sign-Up Request Body:", req.body);

    const existingUser = await User.findOne({ email });

    console.log("Existing User:", existingUser);

    if (existingUser) {
      throw AppError("Email already in use", 409);
    }

    //hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
    if (!JWT_SECRET || !JWT_EXPIRES_IN) {
      throw new Error("JWT_SECRET or JWT_EXPIRES_IN is not defined");
    }

    const token = jwt.sign(
      {
        id: newUsers[0]._id,
        email: newUsers[0].email,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "User signed up successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const handleSignIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw AppError("Invalid email or password", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: ms("7d"),
    });
    res.status(200).json({
      message: "User signed in successfully",
      data: {
        user: { ...user.toObject(), password: undefined },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleSignOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
