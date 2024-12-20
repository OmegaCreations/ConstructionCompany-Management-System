import * as warehouseModel from "../models/warehouseModel";
import { Magazyn, MagazynZasob, MagazynZasobExtended } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all warehouses
export const getAllWarehouses = async () => {
  return (await warehouseModel.getAll()) as Magazyn[];
};

// Finds all resources for specific warehouse with specific view depending on user role
export const getWarehouseResources = async (
  magazyn_id: number,
  role: string
): Promise<MagazynZasob[] | MagazynZasobExtended[]> => {
  if (role === "worker") {
    return (await warehouseModel.getResourcesAsWorker(
      magazyn_id
    )) as MagazynZasob[];
  } else if (role === "manager") {
    return (await warehouseModel.getResourcesAsManager(
      magazyn_id
    )) as MagazynZasobExtended[];
  } else {
    throw new Error(`Invalid role: ${role}`);
  }
};
