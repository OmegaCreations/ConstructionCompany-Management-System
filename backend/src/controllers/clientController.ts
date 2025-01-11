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

// returns client's data and their orders
export const getClientAsClient: any = async (req: any, res: Response) => {
  const clientToken = String(req.query.token);
  const clientEmail: string = String(req.body.email);

  if (!clientToken) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const clientData = await clientService.getClientAsClient(
      clientToken,
      clientEmail
    );
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

// ================================
//        POST REQUESTS
// ================================

// creates new client
export const createClient: any = async (req: Request, res: Response) => {
  const { imie, nazwisko, firma, telefon, email, adres } = req.body;

  // check if required data was passed
  if (!imie || !nazwisko || !firma || !email || !telefon || !adres) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // creating new client
  try {
    // I feel that there is no need to return new client data especially
    // because frontend shows returned data after post request.
    const clientToken = await clientService.createNewClient({
      imie,
      nazwisko,
      firma,
      telefon,
      email,
      adres,
    });

    res.status(201).json({
      info:
        "Klient został utworzony! O to adres dostępu dla klienta: http://localhost:5173/client/public?token=" +
        String(clientToken),
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during client creation.",
    });
  }
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteClient: any = async (req: Request, res: Response) => {
  const { klient_id } = req.body;

  if (!klient_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await clientService.deleteClient(Number(klient_id));

    res.status(201).json({
      info: "Klient został usunięty!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during client deleting.",
    });
  }

  return;
};

// ================================
//           PUT REQUESTS
// ================================

export const updateClient: any = async (req: Request, res: Response) => {
  const { klient_id, imie, nazwisko, firma, telefon, email, adres } = req.body;

  if (!klient_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await clientService.updateClient({
      klient_id,
      imie,
      nazwisko,
      firma,
      telefon,
      email,
      adres,
    });

    res.status(201).json({
      info: "Klient został zaktualizowany!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Client updating.",
    });
  }

  return;
};
