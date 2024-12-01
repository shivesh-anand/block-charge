import UserQueue from '../models/userQueueModel.js';
import StationQueue from '../models/stationQueueModel.js';
import { Request, Response } from 'express';

export const clearElement = async (req: Request, res: Response) => {
    try {
        const queueItem = await UserQueue.find(
            {
                StationRef: req.body.stationId,
                UserRef: req.body.userId
            }
        );
        if(!queueItem) {
            res.status(404).json({
                'message': `Pair not found: <${req.body.stationId}, ${req.body.userId}>`
            });
            return;
        }
        await UserQueue.deleteOne(
            {
                StationRef: req.body.stationId,
                UserRef: req.body.userId
            }
        ); 
        res.status(200).json({
            'message': `Success`
        });
        return;
    } catch(err) {
        res.status(500).json({
            'message': err
        });
    }
}

export const verifyElement = async (req: Request, res: Response) => {
    try {
        const queueItem = await StationQueue.find(
            {
                StationRef: req.body.stationId,
                UserRef: req.body.userId
            }
        );
        if(!queueItem) {
            res.status(404).json({
                'message': `Pair not found: <${req.body.stationId}, ${req.body.userId}>`
            });
            return;
        }
        await StationQueue.deleteOne(
            {
                StationRef: req.body.stationId,
                UserRef: req.body.userId
            }
        ); 
        res.status(200).json({
            'message': `Success`
        });
        return;
    } catch(err) {
        res.status(500).json({
            'message': err
        });
    }
}