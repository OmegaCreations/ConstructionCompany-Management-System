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

// ================================
//        POST REQUESTS
// ================================

// creates new resource
export const createResource: any = async (req: Request, res: Response) => {
  const { nazwa, jednostka, typ, opis, koszt_jednostkowy } = req.body;

  // check if required data was passed
  if (!nazwa || !opis || !jednostka || !opis || !koszt_jednostkowy) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // creating new Resource
  try {
    await resourceService.createNewResource({
      nazwa,
      jednostka,
      typ,
      opis,
      koszt_jednostkowy,
    });

    res.status(201).json({
      info: "Nowy zasób został utworzony!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during resource creation.",
    });
  }
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteResource: any = async (req: Request, res: Response) => {
  const { zasob_id } = req.body;

  if (!zasob_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await resourceService.deleteResource(Number(zasob_id));

    res.status(201).json({
      info: "Zasób został usunięty!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Resource deleting.",
    });
  }

  return;
};
