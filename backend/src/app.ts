import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// routes
import helloRoutes from "./routes/helloRoutes";
import userRoutes from "./routes/userRoutes";
import clientRoutes from "./routes/clientRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import workdayRoutes from "./routes/workdayRoutes";
import warehouseRoutes from "./routes/warehouseRoutes";
import positionRoutes from "./routes/positionRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import shoppingListRoutes from "./routes/shoppingListRoutes";
import globalRoutes from "./routes/globalRoutes";

// middleware
import loggerMiddleware from "./middlewares/loggerMiddleware";

// Here we create express app instance
const app: Application = express();

// Middleware ===============================================================
const corsOptions = {
  origin: "http://localhost:5173", // localhost frontend adress
  credentials: true, // allow sending cookies
};
app.use(cors(corsOptions));
app.use(helmet()); // HTTP security for express apps
app.use(express.json()); // parsing JSON
app.use(cookieParser());
app.use(loggerMiddleware); // will log all requests with data and endpoints

// All routes ================================================================
// user auth routes
app.use("/api/auth", authRoutes); // authentication routes
app.use("/api/user", userRoutes); // user management routes
app.use("/api/client", clientRoutes); // client management routes
app.use("/api/order", orderRoutes); // order management routes
app.use("/api/workday", workdayRoutes); // work days management routes
app.use("/api/warehouse", warehouseRoutes); // warehouses management routes
app.use("/api/position", positionRoutes); // position management routes
app.use("/api/resource", resourceRoutes); // resource management routes
app.use("/api/shoppinglist", shoppingListRoutes); // shopping list routes

// Endpoint to show how project structure works :)
app.use("/api", helloRoutes);

// db reset endpoint
app.use("/api/db", globalRoutes);

export default app;
