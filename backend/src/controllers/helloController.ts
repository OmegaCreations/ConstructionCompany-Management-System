import { Request, Response } from "express";
import helloService from "../services/helloService";

// controlls data flow
export const getHello = async (req: Request, res: Response) => {
  try {
    const message = await helloService.getHelloMessage();
    res.json({ message }); // returns data in json format
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" }); // some internal server error
  }
};
