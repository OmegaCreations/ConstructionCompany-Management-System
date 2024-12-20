import { Request, Response } from "express";
import * as clientService from "../services/clientService";
import { Klient } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// gets all clients data
export const getAllClients: any = async (req: Request, res: Response) => {
  try {
    const clientData: Klient[] = await clientService.getAllClients();
    return res.status(200).json(clientData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during fetching clients.",
    });
  }
};

// gets user's data
export const getClient: any = async (req: Request, res: Response) => {
  const klient_id = Number(req.params.id); // requested client id in url

  if (!klient_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const clientData: Klient = await clientService.getClient(klient_id);
    return res.status(200).json(clientData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching client data.",
    });
  }
};