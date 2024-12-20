import * as clientModel from "../models/clientModel";
import { Klient } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// returns all clients
export const getAllClients = async () => {
  return await clientModel.getAll();
};

// returns existing client with klient_id
export const getClient = async (klient_id: number) => {
  const existingClient: Klient | null = await clientModel.findById(klient_id);
  if (!existingClient) {
    throw new Error("Client with given credentials does not exist.");
  }

  return existingClient;
};
