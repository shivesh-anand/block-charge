import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Station from "../models/stationModel.js";
import User from "../models/userModel.js";
import { addTransaction } from "./blockchainController.js";

interface JwtPayload {
  id: string;
  role: string;
}

export const register = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    type, // "user" or "station"
    vehicleType,
    vehicleNumber,
    location, // For stations
    chargers, // For stations
    placeId, // For stations
  } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Account already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Construct user data
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      type,
      stake: 0, // Default stake
      ...(type === "user" && { vehicleType, vehicleNumber }),
      ...(type === "station" && { location, chargers, placeId }),
    };

    // Create user or station
    const user = await User.create(userData);

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email, role: type },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Prepare transaction data
    const transactionData = {
      from: "System", // Could be changed to a real sender if necessary
      to: user._id.toString(),
      data: JSON.stringify(userData),
      type: "SIGN_UP" as "SIGN_UP",
    };

    // Add the transaction using the blockchain controller function
    await addTransaction(transactionData); // Call addTransactionData directly

    return res.status(201).json({
      message: `${type === "user" ? "User" : "Station"} created successfully`,
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, vehicleType, vehicleNumber } =
    req.body;

  console.log(req.body);

  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !vehicleType ||
      !vehicleNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      vehicleType,
      vehicleNumber,
    });

    console.log(user);

    const token = jwt.sign(
      { userId: user._id, email, role: "user" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    if (user) {
      return res
        .status(201)
        .json({ message: "User Created Successfully", token });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("User Registration Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const registerStation = async (req: Request, res: Response) => {
  const { stationName, email, password, location, chargers, placeId } =
    req.body;

  console.log(req.body);

  try {
    const stationExists = await Station.findOne({ email });
    console.log(stationExists);
    if (stationExists) {
      return res.status(409).json({ message: "Station already exists" }); // Use 409 for conflict
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const station = await Station.create({
      stationName,
      email,
      password: hashedPassword,
      location,
      chargers,
      placeId,
    });

    console.log(station);

    const token = jwt.sign(
      { stationId: station._id, email, role: "station" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    if (station) {
      return res
        .status(201)
        .json({ message: "Station Created Successfully", token });
    } else {
      return res.status(400).json({ message: "Invalid station data" });
    }
  } catch (error) {
    console.error("Station Registration Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { userId: user._id, email, role: "user" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "User Login Successful", token });
  } catch (error) {
    console.error("User Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginStation = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const station = await Station.findOne({ email });
    if (!station) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, station.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { stationId: station._id, email, role: "station" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Station Login Successful", token });
  } catch (error) {
    console.error("Station Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
