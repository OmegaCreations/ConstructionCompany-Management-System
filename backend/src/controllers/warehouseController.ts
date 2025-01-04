import { Request, Response } from "express";
import * as warehouseService from "../services/warehouseService";
import {
  CreateWarehouseResourceInput,
  Magazyn,
  MagazynZasob,
  MagazynZasobExtended,
} from "../utils/types";
import { getRoleByPositionId } from "../utils/appTypes";

// ================================
//        GET REQUESTS
// ================================

// Returns all warehouses
export const getAllWarehouses: any = async (req: Request, res: Response) => {
  try {
    const warehousesData: Magazyn[] = await warehouseService.getAllWarehouses();
    return res.status(200).json(warehousesData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching warehouses data.",
    });
  }
};

// Returns all Warehouses for specific warehouse with specific view depending on user role
export const getWarehouseResources: any = async (req: any, res: Response) => {
  const pracownik_id: number = req.user.pracownik_id;
  const magazyn_id = Number(req.params.id);

  if (!pracownik_id || !magazyn_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const warehouseData: MagazynZasob[] | MagazynZasobExtended[] =
      await warehouseService.getWarehouseResources(
        magazyn_id,
        getRoleByPositionId(req.user.stanowisko_id)
      );
    return res.status(200).json(warehouseData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching warehouse's Warehouses.",
    });
  }
};

// ================================
//        POST REQUESTS
// ================================

// creates new warehouse
export const createWarehouse: any = async (req: Request, res: Response) => {
  const { nazwa, lokalizacja } = req.body;

  // check if required data was passed
  if (!nazwa || !lokalizacja) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // creating new warehouse
  try {
    await warehouseService.createNewWarehouse({
      nazwa,
      lokalizacja,
    });

    res.status(201).json({
      info: "Nowy magazyn został utworzony!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during warehouse creation.",
    });
  }
};

// adds Warehouse to warehouse
export const addResourceToWarehouse: any = async (
  req: Request,
  res: Response
) => {
  const { ilosc, magazyn_id, zasob_id } = req.body;

  // check if required data was passed
  if (!ilosc || !magazyn_id || !zasob_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // adding new Warehouse
  try {
    await warehouseService.addResourceToWarehouse({
      ilosc,
      magazyn_id,
      zasob_id,
    });

    res.status(201).json({
      info: "Nowy zasób został dodany!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during adding Warehouse.",
    });
  }
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWarehouse: any = async (req: Request, res: Response) => {
  const { magazyn_id } = req.body;

  if (!magazyn_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await warehouseService.deleteWarehouse(Number(magazyn_id));

    res.status(201).json({
      info: "Magazyn został usunięty!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Warehouse deleting.",
    });
  }

  return;
};

export const deleteResourceFromWarehouse: any = async (
  req: Request,
  res: Response
) => {
  const { magazyn_zasob_id } = req.body;

  if (!magazyn_zasob_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await warehouseService.deleteResource(Number(magazyn_zasob_id));

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
