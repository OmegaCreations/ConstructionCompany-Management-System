import * as orderModel from "../models/orderModel";
import * as clientModel from "../models/clientModel";
import {
  CreateOrderInput,
  CreateOrderResourceInput,
  Klient,
  Zlecenie,
  ZlecenieZasob,
} from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// returns all orders
export const getAllOrders = async () => {
  return (await orderModel.getAll()) as Zlecenie[];
};

// returns existing order with zlecenie_id
export const getOrder = async (zlecenie_id: number) => {
  const existingOrder: Zlecenie | null = await orderModel.findById(zlecenie_id);
  if (!existingOrder) {
    throw new Error("Order with given credentials does not exist.");
  }

  return existingOrder as Zlecenie;
};

// gets orders of specific client
export const getClientOrders = async (klient_id: number) => {
  const existingClient: Klient | null = await clientModel.findById(klient_id);
  if (!existingClient) {
    throw new Error("Client with given credentials does not exist.");
  }

  return (await orderModel.getAllForClient(klient_id)) as Zlecenie[];
};

// get resources needed for specific order
export const getOrderResources = async (zlecenie_id: number) => {
  const existingOrder: Zlecenie | null = await orderModel.findById(zlecenie_id);
  if (!existingOrder) {
    throw new Error("Order with given credentials does not exist.");
  }

  return (await orderModel.getResources(zlecenie_id)) as ZlecenieZasob[];
};

// get all costs for specific order
export const getOrderCosts = async (zlecenie_id: number) => {
  const existingOrder: Zlecenie | null = await orderModel.findById(zlecenie_id);
  if (!existingOrder) {
    throw new Error("Order with given credentials does not exist.");
  }

  return await orderModel.getCosts(zlecenie_id);
};

// ================================
//        POST REQUESTS
// ================================

// creates new order
export const createNewOrder = async (data: CreateOrderInput) => {
  return await orderModel.create(data);
};

// adds resources to ordeer
export const addResourcesToOrder = async (data: CreateOrderResourceInput[]) => {
  return await orderModel.addResource(data);
};
