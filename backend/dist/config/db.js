"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
// Postgres client that we will use to connect to db
const client = new pg_1.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: {
        // important - this database have no ssl certificate to authorize - we use free version of it
        rejectUnauthorized: false,
    },
});
// Connect to database
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect(); // waits for the connection
        console.log("✅ Connected to database.");
    }
    catch (err) {
        console.error("❌ Error connecting to PostgreSQL database: ", err);
    }
});
exports.connectToDatabase = connectToDatabase;
// Optional: Close the database connection (useful in cleanup/exit process)
const disconnectFromDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.end();
        console.log("✅ Disconnected from database.");
    }
    catch (err) {
        console.error("❌ Error disconnecting from PostgreSQL database: ", err);
    }
});
exports.disconnectFromDatabase = disconnectFromDatabase;
