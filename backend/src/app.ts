import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

// routes
import helloRoutes from "./routes/helloRoutes";

// middleware
import loggerMiddleware from "./middlewares/loggerMiddleware";
import authRoutes from "./routes/authRoutes";
import { checkAuthorizedRole } from "./middlewares/authMiddleware";
import userRoutes from "./routes/userRoutes";

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
// user auth routes
app.use("/api/auth", authRoutes); // authentication routes
app.use("/api/user", userRoutes); // user management routes

// Endpoint to show how project structure works :)
app.use("/api", helloRoutes);

export default app;
