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
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = 5000;
// starts server and connects to database
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connect to db
        yield (0, db_1.connectToDatabase)();
        // start server listener on given port
        app_1.default.listen(PORT, () => {
            console.log(`✅ Server runs on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ There was an error during running server: ", error);
    }
});
// start application
startServer();
