import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

// routes
import helloRoutes from "./routes/helloRoutes";

// middleware
import loggerMiddleware from "./middlewares/loggerMiddleware";
import authRoutes from "./routes/authRoutes";
import { checkAuthorizedRole } from "./middlewares/authMiddleware";

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
app.use("/api/auth", authRoutes);
//app.use("/api/worker", workerRoutes);
// router.get(
//     "/worker/working-hours",
//     checkAuthorizedRole(CompanyRoles.worker),
//     (req, res) => {
//       res.json({ message: "Hello worker!" });
//     }
//   );

// Endpoint to show how project structure works :)
app.use("/api", helloRoutes);

export default app;
