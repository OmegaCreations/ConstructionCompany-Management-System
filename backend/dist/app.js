"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// importing routes here
// import authRoutes from "./routes/authRoutes";
// Middleware for error handling
//import errorHandler from "./middlewares/errorHandler";
// Here we create express app instance
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)()); // HTTP security for express apps
app.use(express_1.default.json()); // parsing JSON
//app.use(errorHandler);
// Trasy API
// app.use("/api/auth", authRoutes);
exports.default = app;
