import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel.js";
import Station from "../models/stationModel.js";

interface JwtPayload {
  userId?: string,
  email?: string,
  role?: string,
  iat?: string,
  exp?: string
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  console.log('Reached');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (decoded.role === "user") {
        req.user = await User.findById(decoded.userId).select("-password");
      } else if (decoded.role === "station") {
        req.user = await Station.findById(decoded.userId).select("-password");
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
