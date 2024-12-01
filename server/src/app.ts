import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { protect } from "./middlewares/authMiddleware.js";
import { setupWebSocketServer } from './utils/ws.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// Logger middleware
app.use(morgan("combined"));

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);

app.use(protect);
app.use("/api/users", userRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/blockchain", blockchainRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    setupWebSocketServer();
  });
});

export default app;
