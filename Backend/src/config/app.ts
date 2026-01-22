import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler, notFound } from "../middleware/errorHandler";
import { customResponseMiddleware } from "../middleware/customResponseMiddleware";
import router from "../routes/route";
import { validate } from "../middleware/validation.middleware";

// Import routes

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
app.use(customResponseMiddleware);

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use("/api", router);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
