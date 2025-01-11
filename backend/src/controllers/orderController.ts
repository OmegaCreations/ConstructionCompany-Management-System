import { Request, Response } from "express";
import * as orderService from "../services/orderService";
import {
  CreateOrderResourceInput,
  Zlecenie,
  ZlecenieKoszty,
  ZlecenieZasob,
} from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// gets all orders data
export const getAllOrders: any = async (req: Request, res: Response) => {
  try {
    const orderData: Zlecenie[] = await orderService.getAllOrders();
    return res.status(200).json(orderData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during fetching orders.",
    });
  }
};

// gets order's data
export const getOrder: any = async (req: Request, res: Response) => {
  const zlecenie_id = Number(req.params.id); // requested order id in url

  if (!zlecenie_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const orderData: Zlecenie = await orderService.getOrder(zlecenie_id);
    return res.status(200).json(orderData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching order data.",
    });
  }
};

// gets Client's orders
export const getClientOrders: any = async (req: Request, res: Response) => {
  const klient_id = Number(req.params.id); // requested Order id in url

  if (!klient_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const orderData: Zlecenie[] = await orderService.getClientOrders(klient_id);
    console.log(orderData);
    return res.status(200).json(orderData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching order data.",
    });
  }
};

// gets order's resources
export const getOrderResources: any = async (req: Request, res: Response) => {
  const order_id = Number(req.params.id); // requested order id in url

  if (!order_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const resourcesData: ZlecenieZasob[] = await orderService.getOrderResources(
      order_id
    );
    return res.status(200).json(resourcesData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching order data.",
    });
  }
};

// gets order's costs
export const getOrderCosts: any = async (req: Request, res: Response) => {
  const order_id = Number(req.params.id); // requested order id in url

  if (!order_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const costData = await orderService.getOrderCosts(order_id);
    return res.status(200).json(costData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching order data.",
    });
  }
};

// gets order profits
export const getOrdersProfits: any = async (req: Request, res: Response) => {
  try {
    const profits = await orderService.getOrdersProfits();
    return res.status(200).json(profits);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching orders' future profits.",
    });
  }
};

// ================================
//        POST REQUESTS
// ================================

// creates new order
export const createNewOrder: any = async (req: Request, res: Response) => {
  const {
    klient_id,
    opis,
    data_zlozenia,
    data_rozpoczenia,
    lokalizacja,
    wycena,
    data_zakonczenia,
  } = req.body;

  // check if required data was passed
  if (
    !klient_id ||
    !opis ||
    !data_zlozenia ||
    !data_rozpoczenia ||
    !wycena ||
    !lokalizacja
  ) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // adding new resource
  try {
    await orderService.createNewOrder({
      klient_id,
      opis,
      data_zlozenia,
      data_rozpoczenia,
      lokalizacja,
      wycena,
      data_zakonczenia,
    });

    res.status(201).json({
      info: "Nowe zlecenie zostało dodane!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during creating order.",
    });
  }
};

// adds resources to order
export const addResourcesToOrder: any = async (req: Request, res: Response) => {
  const { zlecenie_id, zasob_id, ilosc_potrzebna } = req.body;

  // check if required data was passed
  if (!zlecenie_id || !ilosc_potrzebna || !zasob_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // adding new resource
  try {
    await orderService.addResourcesToOrder({
      zlecenie_id,
      zasob_id,
      ilosc_potrzebna,
    });

    res.status(201).json({
      info: "Nowe zasoby zostały dodane do zlecenia!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during adding resources.",
    });
  }
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteOrder: any = async (req: Request, res: Response) => {
  const { zlecenie_id } = req.body;

  if (!zlecenie_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await orderService.deleteOrder(Number(zlecenie_id));

    res.status(201).json({
      info: "Zlecenie zostało usunięte!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Order deleting.",
    });
  }

  return;
};

export const deleteResourceFromOrder: any = async (
  req: Request,
  res: Response
) => {
  const { zasob_id, zlecenie_id } = req.body;

  if (!zasob_id || !zlecenie_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await orderService.deleteResource(Number(zasob_id), Number(zlecenie_id));

    res.status(201).json({
      info: "Zasob zlecenia został usunięty!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during resource deleting.",
    });
  }

  return;
};

// ================================
//           PUT REQUESTS
// ================================

export const updateOrder: any = async (req: Request, res: Response) => {
  const {
    zlecenie_id,
    klient_id,
    wycena,
    opis,
    data_zlozenia,
    data_rozpoczenia,
    data_zakonczenia,
    lokalizacja,
  } = req.body;

  if (!klient_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await orderService.updateOrder({
      zlecenie_id,
      klient_id,
      wycena,
      opis,
      data_zlozenia,
      data_rozpoczenia,
      data_zakonczenia,
      lokalizacja,
    });

    res.status(201).json({
      info: "Zlecenie zostało zaktualizowane!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Order updating.",
    });
  }

  return;
};

export const updateOrderResource: any = async (req: Request, res: Response) => {
  const { zasob_id, zlecenie_id, ilosc_potrzebna } = req.body;

  if (!zasob_id || !zlecenie_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await orderService.updateOrderResource({
      zasob_id,
      zlecenie_id,
      ilosc_potrzebna,
    });

    res.status(201).json({
      info: "Zlecenie zostało zaktualizowane!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Order updating.",
    });
  }

  return;
};
