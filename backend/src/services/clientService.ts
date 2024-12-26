import * as clientModel from "../models/clientModel";
import { CreateClientInput, Klient } from "../utils/types";

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

// ================================
//        POST REQUESTS
// ================================
export const createNewClient = async (clientData: CreateClientInput) => {
  const { imie, nazwisko, firma, telefon, email, adres } = clientData;

  // check if client already exists
  const existingClient: Klient | null = await clientModel.findByEmail(email);
  if (existingClient) {
    throw new Error("Client with given email already exists.");
  }
  // creating new client
  await clientModel.create({
    imie,
    nazwisko,
    firma,
    telefon,
    email,
    adres,
  });

  return;
};
