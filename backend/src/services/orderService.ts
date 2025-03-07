import * as orderModel from "../models/orderModel";
import * as clientModel from "../models/clientModel";
import {
  CreateOrderInput,
  CreateOrderResourceInput,
  Klient,
  Zasob,
  Zlecenie,
  ZlecenieUpdate,
  ZlecenieZasob,
  ZlecenieZasobUpdate,
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

// get all future profits for orders
export const getOrdersProfits = async () => {
  return await orderModel.getProfits();
};

// ================================
//        POST REQUESTS
// ================================

// creates new order
export const createNewOrder = async (data: CreateOrderInput) => {
  return await orderModel.create(data);
};

// adds resources to ordeer
export const addResourcesToOrder = async (data: CreateOrderResourceInput) => {
  return await orderModel.addResource(data);
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteOrder = async (zlecenie_id: number) => {
  const deletedOrder: Zlecenie = await orderModel.deleteWithId(zlecenie_id);

  if (!deleteOrder) {
    throw new Error("Order was not deleted.");
  }

  return;
};

export const deleteResource = async (zasob_id: number, zlecenie_id: number) => {
  const deletedResource: ZlecenieZasob = await orderModel.deleteResource(
    zasob_id,
    zlecenie_id
  );

  if (!deletedResource) {
    throw new Error("Resource was not deleted.");
  }

  return;
};

// ================================
//         PUT REQUESTS
// ================================
export const updateOrder = async (orderData: ZlecenieUpdate) => {
  return await orderModel.update(orderData);
};

export const updateOrderResource = async (
  resourceData: ZlecenieZasobUpdate
) => {
  return await orderModel.updateResource(resourceData);
};
