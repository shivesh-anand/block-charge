import StationQueue from '../models/stationQueueModel.js';
import { addTransaction } from './blockchainController.js';
import User from '../models/userModel.js';
import { Request, Response } from 'express';

export const verifyElement = async (req: Request, res: Response) => {
  try {
    const { stationId, userId } = req.body;

    const queueItem = await StationQueue.findOne({
      StationRef: stationId,
      UserRef: userId,
    });

    if (!queueItem) {
      res.status(404).json({
        message: `Pair not found: <${stationId}, ${userId}>`,
      });
      return;
    }

    const transactionData = {
      from: stationId,
      to: userId,
      data: "",
      type: "VERIFICATION" as const,
    };

    try {
      await addTransaction(transactionData);

      queueItem.success = true;
      await queueItem.save();

      res.status(200).json({
        message: 'success',
        queueItem,
      });
    } catch (transactionError: any) {
      console.error("Transaction error:", transactionError);

      queueItem.success = false;
      await queueItem.save();

      res.status(500).json({
        message: "Failed Transaction",
        error: transactionError.message,
        queueItem,
      });
    }
  } catch (err: any) {
    console.error("Error verifying element:", err);
    res.status(500).json({
      message: "Server error during verification",
      error: err.message,
    });
  }
};

export const fetchUsers = async (req: Request, res: Response) => {
    try {
        const stationId = req.body.stationId;
        const check: any = await StationQueue.findOne({
            StationRef: stationId,
            success: false, 
        })
        if(!check) {
            res.status(200).json({
                users: []
            })
            return;
        }
        const data = await StationQueue.find({
            StationRef: stationId,
            success: false,
          })
            .populate({
              path: "UserRef",
              select: "firstName lastName email vehicleType vehicleNumber",
            }) // Populate UserRef
            .populate("StationRef", "name location"); // Optionally populate StationRef if needed
      
          // Format the data
          const Users = data.map((queue) => ({
            _id: queue.UserRef,
            userName: `${queue.UserRef.firstName} ${queue.UserRef.lastName}`,
            vehicleNumber: queue.UserRef.vehicleNumber,
            vehicleType: queue.UserRef.vehicleType,
            email: queue.UserRef.email,
            checkInTime: queue.createdAt, // Use the createdAt field as checkInTime
          }));
      
        res.status(200).json({
            users : Users
        });
        return;
    } catch(err) {
        res.status(500).json({
            message : err
        });
    }
};

export const addItems = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user!;
        const stationId = req.body.stationId; 
        const queueItem = await StationQueue.findOne({
            StationRef: stationId,
            UserRef: userId,
            success: false
        });
        if(queueItem) {
            res.status(400).json({
                message: 'User is already in queue'
            });
            return;
        }
        await StationQueue.create({
            StationRef: stationId,
            UserRef: userId,
            success: false
        });
        res.status(200).json({
            message: 'success'
        });
        return;
    } catch(err) {
        res.status(500).json({
            message: err
        });
        return;
    } 
}