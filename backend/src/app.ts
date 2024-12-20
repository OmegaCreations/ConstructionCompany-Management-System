import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

// routes
import helloRoutes from "./routes/helloRoutes";
import userRoutes from "./routes/userRoutes";
import clientRoutes from "./routes/clientRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import workdayRoutes from "./routes/workdayRoutes";

// middleware
import loggerMiddleware from "./middlewares/loggerMiddleware";

// Here we create express app instance
const app: Application = express();

// Middleware ===============================================================
app.use(cors());
app.use(helmet()); // HTTP security for express apps
app.use(express.json()); // parsing JSON
app.use(loggerMiddleware); // will log all requests with data and endpoints

// All routes ================================================================
// user auth routes
app.use("/api/auth", authRoutes); // authentication routes
app.use("/api/user", userRoutes); // user management routes
app.use("/api/client", clientRoutes); // client management routes
app.use("/api/order", orderRoutes); // order management routes
app.use("/api/workday", workdayRoutes); // work days management routes

// Endpoint to show how project structure works :)
app.use("/api", helloRoutes);

export default app;
