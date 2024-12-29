import * as resourceModel from "../models/resourceModel";
import { CreateResourceInput, Zasob } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all resources
export const getAllResources = async () => {
  return (await resourceModel.getAll()) as Zasob[];
};

// ================================
//        POST REQUESTS
// ================================

// creates new resource
export const createNewResource = async (resourceData: CreateResourceInput) => {
  const { nazwa, jednostka, typ, opis } = resourceData;

  if (typ !== "material" && typ !== "sprzet") {
    throw new Error("Niezgodny typ zasobu (material, sprzet)");
  }

  // creating new resource
  await resourceModel.create({
    nazwa,
    jednostka,
    typ,
    opis,
  });

  return;
};
