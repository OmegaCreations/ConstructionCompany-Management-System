import { Request, Response } from "express";
import * as orderService from "../services/orderService";
import { Zlecenie, ZlecenieKoszty, ZlecenieZasob } from "../utils/types";

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

// gets client's orders
export const getClientOrders: any = async (req: Request, res: Response) => {
  const klient_id = Number(req.params.id); // requested client id in url

  if (!klient_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const orderData: Zlecenie[] = await orderService.getClientOrders(klient_id);
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
