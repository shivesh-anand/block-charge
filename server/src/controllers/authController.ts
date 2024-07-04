import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Station from '../models/Station.js';
import { generateToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, vehicleType } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      vehicleType,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        vehicleType: user.vehicleType,
        token: generateToken(user._id as string, 'user'),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerStation = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, location, chargers } = req.body;

  try {
    const stationExists = await Station.findOne({ email });

    if (stationExists) {
      return res.status(400).json({ message: 'Station already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const station = await Station.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      location,
      chargers,
    });

    if (station) {
      res.status(201).json({
        _id: station._id,
        firstName: station.firstName,
        lastName: station.lastName,
        email: station.email,
        location: station.location,
        chargers: station.chargers,
        token: generateToken(station._id as string, 'station'),
      });
    } else {
      res.status(400).json({ message: 'Invalid station data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        vehicleType: user.vehicleType,
        token: generateToken(user._id as string, 'user'),
        message: 'Logged In Successfully',
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginStation = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const station = await Station.findOne({ email });
    if (station && (await bcrypt.compare(password, station.password))) {
      res.json({
        _id: station._id,
        firstName: station.firstName,
        lastName: station.lastName,
        email: station.email,
        location: station.location,
        chargers: station.chargers,
        token: generateToken(station._id as string, 'station'),
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // No need to handle token invalidation on server-side
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    let user;
    if (decoded.role === 'user') {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.role === 'station') {
      user = await Station.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User or station not found' });
    }

    res.status(200).json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token is not valid' });
  }
};
