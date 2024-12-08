import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

// importing routes here
// TODO: import authRoutes from "./routes/authRoutes";

// Middleware for error handling
// TODO: import errorHandler from "./middlewares/errorHandler";

// Here we create express app instance
const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet()); // HTTP security for express apps
app.use(express.json()); // parsing JSON
//app.use(errorHandler);

// Trasy API
// app.use("/api/auth", authRoutes);

export default app;
