import { Request, Response } from 'express';
import Station from '../models/Station.js';
import User from '../models/User.js';

export const verifyCheckIn = async (req: Request, res: Response) => {
  const { stationId, userId } = req.body;

  try {
    const station = await Station.findById(stationId);
    const user = await User.findById(userId);

    if (station && user) {
      // Implement your check-in logic here
      res.json({ message: 'Check-in verified successfully' });
    } else {
      res.status(404).json({ message: 'Station or user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentStation = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(404).json({ message: 'Station not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
