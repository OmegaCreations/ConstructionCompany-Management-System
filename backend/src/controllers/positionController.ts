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
