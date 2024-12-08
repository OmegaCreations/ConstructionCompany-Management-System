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
exports.closeConnectionToDatabase = exports.connectToDatabase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg"); // module for PostgreSQL connections
dotenv_1.default.config();
// Postgres client that we will use to connect to db
const client = new pg_1.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});
// connects to database
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    client
        .connect() // returns Promise object
        .then(() => {
        console.log("✅ Connected to database.");
    })
        .catch((err) => {
        console.error("❌ Error connecting to PostgreSQL database: ", err);
    });
});
exports.connectToDatabase = connectToDatabase;
// closes connection to database
const closeConnectionToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    client
        .end() // returns Promise object
        .then(() => {
        console.log("✅ Connection to PostgreSQL closed");
    })
        .catch((err) => {
        console.error("❌ Error closing connection", err);
    });
});
exports.closeConnectionToDatabase = closeConnectionToDatabase;
