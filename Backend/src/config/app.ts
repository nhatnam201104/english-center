import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { errorHandler, notFound } from "../middleware/errorHandler";
import { customResponseMiddleware } from "../middleware/customResponseMiddleware";
import router from "../routes/route";

// Import routes

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
app.use(customResponseMiddleware);

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from uploads directory
// process.cwd() trả về thư mục gốc của project (Backend/)
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api", router);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
