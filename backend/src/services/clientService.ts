import * as clientModel from "../models/clientModel";
import * as orderModel from "../models/orderModel";
import { CreateClientInput, Klient, Zlecenie } from "../utils/types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

interface clientVerify {
  klient_id: number;
  email: string;
}

// returns client's and their orders' data based on token in url
export const getClientAsClient = async (clientToken: string, email: string) => {
  const clientAccessData: clientVerify = jwt.verify(
    clientToken,
    String(process.env.JWT_CLIENT_SECRET)
  ) as unknown as clientVerify;
  console.log(clientAccessData);
  if (email !== clientAccessData.email) {
    throw new Error("Invalid email or token.");
  } else {
    // get client's profile data
    const existingClient: Klient | null = await clientModel.findByEmail(email);
    if (!existingClient) {
      throw new Error("Client with given email does not exists.");
    }

    // get all orders for a client
    const clientOrders: Zlecenie[] = await orderModel.getAllForClientAsClient(
      clientAccessData.klient_id
    );
    return { client: existingClient, orders: clientOrders };
  }
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
  const newClient: Klient = await clientModel.create({
    imie,
    nazwisko,
    firma,
    telefon,
    email,
    adres,
  });

  // generate client "magic link" to status page
  const clientToken = jwt.sign(
    { klient_id: newClient.klient_id, email: newClient.email },
    String(process.env.JWT_CLIENT_SECRET),
    {
      expiresIn: "1h", // jwt expire time
    }
  );

  return clientToken;
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteClient = async (klient_id: number) => {
  const deletedClient: Klient = await clientModel.deleteWithId(klient_id);

  if (!deletedClient) {
    throw new Error("Client was not deleted.");
  }

  return;
};

// ================================
//         PUT REQUESTS
// ================================
export const updateClient = async (clientData: Klient) => {
  return await clientModel.update(clientData);
};
