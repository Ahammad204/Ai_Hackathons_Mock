import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Request body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Compression
app.use(compression());

// Rate limiting — 100 requests per 15-minute window
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: "Too many requests, please try again later" },
});
app.use(limiter);

// Request logging
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use(healthRoutes);
app.use(ticketRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: true, message: "Route not found" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;
