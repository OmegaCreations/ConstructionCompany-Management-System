import { Request, Response } from "express";
import * as warehouseService from "../services/warehouseService";
import { Magazyn, MagazynZasob, MagazynZasobExtended } from "../utils/types";
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

// Returns all resources for specific warehouse with specific view depending on user role
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
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching warehouse's resources.",
    });
  }
};
