import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

// routes
import helloRoutes from "./routes/helloRoutes";
import loggerMiddleware from "./middlewares/loggerMiddleware";

// importing routes here
// TODO: import authRoutes from "./routes/authRoutes";

// Middleware for error handling
// TODO: import errorHandler from "./middlewares/errorHandler";

// Here we create express app instance
const app: Application = express();

// Middleware ===============================================================
app.use(cors());
app.use(helmet()); // HTTP security for express apps
app.use(express.json()); // parsing JSON
app.use(loggerMiddleware); // will log all requests with data and endpoints
//app.use(errorHandler);

// All routes ================================================================
// app.use("/api/auth", authRoutes);

// Endpoint to show how project structure works :)
app.use("/api", helloRoutes);

export default app;
