import { Request, Response } from "express";
import Station from "../models/stationModel.js";
import User from "../models/userModel.js";

export const verifyCheckIn = async (req: Request, res: Response) => {
  const { stationId, userId } = req.body;

  try {
    const station = await Station.findById(stationId);
    const user = await User.findById(userId);

    if (station && user) {
      // Implement your check-in logic here
      res.json({ message: "Check-in verified successfully" });
    } else {
      res.status(404).json({ message: "Station or user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentStation = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStation = async (req: Request, res: Response) => {
  const updateFields = req.body;

  try {
    // Check if station exists
    const station = await Station.findById(req.user._id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Update station details with provided fields
    Object.keys(updateFields).forEach((key) => {
      // Only update fields that are present in the request body
      if (updateFields[key] !== undefined) {
        (station as any)[key] = updateFields[key];
      }
    });

    await station.save();

    res
      .status(200)
      .json({ message: "Station details updated successfully", station });
  } catch (error) {
    console.error("Error updating station details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStationByPlaceId = async (req: Request, res: Response) => {
  const { placeId } = req.params;

  try {
    const station = await Station.findOne({ placeId });

    if (station) {
      res.status(200).json(station);
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    console.error("Error fetching station by placeId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addUserToQueue = async (req: Request, res: Response) => {
  const { placeId, email, vehicleType } = req.body;

  try {
    const station = await Station.findOne({ placeId });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const newQueueItem = {
      email,
      vehicleType,
    };

    if (!station.queueItems) {
      station.queueItems = [];
    }

    station.queueItems.push(newQueueItem);
    await station.save();

    res
      .status(201)
      .json({ message: "User added to queue successfully", station });
  } catch (error) {
    console.error("Error adding user to queue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all queue items for a particular station
export const getQueueItems = async (req: Request, res: Response) => {
  const { placeId } = req.params;

  try {
    const station = await Station.findOne({ placeId });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.status(200).json({ queueItems: station.queueItems || [] });
  } catch (error) {
    console.error("Error fetching queue items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete one or more queue items
export const deleteQueueItems = async (req: Request, res: Response) => {
  const { placeId } = req.params;
  const { email } = req.body; // Array of emails to delete

  try {
    const station = await Station.findOne({ placeId });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    station.queueItems = station.queueItems?.filter(
      (item) => !email.includes(item.email)
    );

    await station.save();

    res
      .status(200)
      .json({ message: "Queue items deleted successfully", station });
  } catch (error) {
    console.error("Error deleting queue items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
