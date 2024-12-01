import { WebSocketServer, WebSocket } from 'ws';
import StationQueue from '../models/StationQueueModel.js';
import UserQueue from '../models/UserQueueModel.js';
import jwt from "jsonwebtoken";
import { token } from 'morgan';

interface JwtPayload {
    userId?: string,
    email?: string,
    role?: string,
    iat?: string,
    exp?: string
  }
  
  const getId = (from: string) => {
        const newObject = jwt.verify(from, process.env.JWT_SECRET!) as JwtPayload;
        return newObject.userId;
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Token has expired:', error.expiredAt);
            return null; 
        }
        throw er
    };

export const setupWebSocketServer = () => {
    const wss = new WebSocketServer({ port: 5001 });

    const clients = new Map<string, WebSocket>();

    wss.on('connection', (ws: WebSocket) => {

        ws.on('message', async (d: string) => {
            const data = JSON.parse(d);
            const from = data.from;
            const to = data.to;
            const text = data.text;
            const type = data.type;
            const success = data.success;     

            if(text === 'Initialize') {
                console.log(`A client connected ${from}`);
                
                if(type === 'Station') {
                    clients.set(from, ws);
                    const queueItems = await StationQueue.find({
                        StationRef: from
                    }) || [];
                    ws.send(JSON.stringify(queueItems));
                }
                                
                if(type === 'User') {
                    const UserId: any = getId(from);
                    clients.set(UserId, ws);
                    const queueItems = await UserQueue.find({
                        UserRef: UserId
                    }) || [];
                    ws.send(JSON.stringify(queueItems));
                }
            } else {
                if(type === 'User') {
                    const UserId: any = getId(from);
                    const user = await StationQueue.findOne({
                        UserRef: UserId,
                        StationRef: to
                    });
                    if(!user) {
                        await StationQueue.create({
                            UserRef: UserId,
                            StationRef: to
                        });
                        const queueItems = await StationQueue.find({
                            StationRef: to
                        }) || [];
                        const toSocket = clients.get(to);
                        if(toSocket) {
                            toSocket.send(JSON.stringify(queueItems));
                        }
                    }
                }
                    if(type === 'Station') {
                        const user = await UserQueue.findOne({
                            UserRef: to,
                            StationRef: from
                        });
                        console.log('user:', user);
                        if(!user) {
                            await UserQueue.create({
                                UserRef: to,
                                StationRef: from,
                                success: success
                            });
                            const queueItems = await UserQueue.find({
                                UserRef: to
                            }) || [];
                            const toSocket = clients.get(to);
                            if(toSocket) {
                                console.log(queueItems);
                                toSocket.send(JSON.stringify(queueItems));
                            }
                        }
                    }  
            }
        });

        ws.on('close', () => {
            for (const [from, socket] of clients.entries()) {
                if (socket === ws) {
                    clients.delete(from);
                    console.log(`A client disconnected ${ws}`);
                    console.log(from);
                    break;
                }
            }
        });
    });
};
