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
  const { nazwa, jednostka, typ, opis, koszt_jednostkowy } = resourceData;

  if (typ !== "material" && typ !== "sprzet") {
    throw new Error("Niezgodny typ zasobu (material, sprzet)");
  }

  // creating new resource
  await resourceModel.create({
    nazwa,
    jednostka,
    typ,
    opis,
    koszt_jednostkowy,
  });

  return;
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteResource = async (zasob_id: number) => {
  const deletedResource: Zasob = await resourceModel.deleteWithId(zasob_id);

  if (!deletedResource) {
    throw new Error("Resource was not deleted.");
  }

  return;
};

// ================================
//         PUT REQUESTS
// ================================

export const updateZasob = async (resourceData: Zasob) => {
  return await resourceModel.update(resourceData);
};
