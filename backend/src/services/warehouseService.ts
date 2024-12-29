import * as warehouseModel from "../models/warehouseModel";
import {
  CreateWarehouseInput,
  Magazyn,
  MagazynZasob,
  MagazynZasobExtended,
} from "../utils/types";

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

// ================================
//        POST REQUESTS
// ================================

// creates new warehouse
export const createNewWarehouse = async (
  positionData: CreateWarehouseInput
) => {
  const { nazwa, lokalizacja } = positionData;

  // check if warehouse already exists
  const existingWarehouse: Magazyn | null = await warehouseModel.findByName(
    nazwa
  );
  if (existingWarehouse) {
    throw new Error("Warehouse with given name already exists.");
  }

  // creating new warehouse
  await warehouseModel.create({
    nazwa,
    lokalizacja,
  });

  return;
};
