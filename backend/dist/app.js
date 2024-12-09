"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// routes
const helloRoutes_1 = __importDefault(require("./routes/helloRoutes"));
// middleware
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Middleware for error handling
// TODO: import errorHandler from "./middlewares/errorHandler";
// Here we create express app instance
const app = (0, express_1.default)();
// Middleware ===============================================================
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)()); // HTTP security for express apps
app.use(express_1.default.json()); // parsing JSON
app.use(loggerMiddleware_1.default); // will log all requests with data and endpoints
//app.use(errorHandler);
// All routes ================================================================
// user auth routes
app.use("/api/auth", authRoutes_1.default);
//app.use("/api/worker", workerRoutes);
// router.get(
//     "/worker/working-hours",
//     checkAuthorizedRole(CompanyRoles.worker),
//     (req, res) => {
//       res.json({ message: "Hello worker!" });
//     }
//   );
// Endpoint to show how project structure works :)
app.use("/api", helloRoutes_1.default);
exports.default = app;
