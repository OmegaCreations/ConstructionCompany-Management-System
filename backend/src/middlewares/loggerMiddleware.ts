import { Request, Response, NextFunction } from "express";

// middleware
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // we go to the next middleware or controller
};

export default loggerMiddleware;
