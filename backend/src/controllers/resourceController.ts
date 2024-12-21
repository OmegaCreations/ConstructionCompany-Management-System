import { Request, Response } from "express";
import * as resourceService from "../services/resourceService";
import { Zasob } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Returns all resources
export const getAllResources: any = async (req: Request, res: Response) => {
  try {
    const resourceData: Zasob[] = await resourceService.getAllResources();
    return res.status(200).json(resourceData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching resources' data.",
    });
  }
};
