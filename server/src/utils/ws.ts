import { WebSocketServer, WebSocket } from 'ws';
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId?: string,
    email?: string,
    role?: string,
    iat?: string,
    exp?: string
}

const getId = (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded.userId;
}

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
                console.log(clients.size);
                if(type === 'User') {
                    const userId = getId(from);
                    if(userId){
                        clients.set(userId, ws);
                    }
                } else {
                    clients.set(from, ws);
                }
            } else {
                if(type === 'User') {
                    const userId = getId(from);
                    const toSocket = clients.get(to);
                    if(toSocket) {
                        toSocket.send(JSON.stringify({
                            from: userId
                        }));
                    }
                }
                if(type === 'Station') {
                    console.log(to);
                    const toSocket = clients.get(to);
                    if(toSocket) {
                        toSocket.send(JSON.stringify({
                            from: toSocket,
                            success: success
                        }));
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
