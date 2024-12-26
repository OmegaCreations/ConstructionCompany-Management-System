import { Request, Response } from "express";
import * as positionService from "../services/positionService";
import { Stanowisko } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Returns all positions
export const getAllPositions: any = async (req: Request, res: Response) => {
  try {
    const positionData: Stanowisko[] = await positionService.getAllPositions();
    return res.status(200).json(positionData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching warehouses data.",
    });
  }
};

// ================================
//        POST REQUESTS
// ================================

// creates new position
export const createPosition: any = async (req: Request, res: Response) => {
  const { nazwa, opis } = req.body;

  // check if required data was passed
  if (!nazwa || !opis) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // creating new position
  try {
    await positionService.createNewPosition({
      nazwa,
      opis,
    });

    res.status(201).json({
      info: "Nowe stanowisko zostało utworzone!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during position creation.",
    });
  }
};
