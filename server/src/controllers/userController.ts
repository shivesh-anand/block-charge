import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/userModel.js";

export const updateUserPassword = async (req: Request, res: Response) => {
  const { id } = req.user!;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Invalid old password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserVehicleType = async (req: Request, res: Response) => {
  const { id } = req.user!;
  const { vehicleType } = req.body;

  try {
    const user = await User.findById(id);
    if (user) {
      user.vehicleType = vehicleType;
      await user.save();
      res.json({ message: "Vehicle type updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
