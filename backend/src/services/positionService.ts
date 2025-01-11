import * as positionModel from "../models/positionModel";
import { CreatePositionInput, Stanowisko } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all positions
export const getAllPositions = async () => {
  return (await positionModel.getAll()) as Stanowisko[];
};

// ================================
//        POST REQUESTS
// ================================

// creates new position
export const createNewPosition = async (positionData: CreatePositionInput) => {
  const { nazwa, opis } = positionData;

  // check if position already exists
  const existingPosition: Stanowisko | null = await positionModel.findByName(
    nazwa
  );
  if (existingPosition) {
    throw new Error("Position with given name already exists.");
  }

  // creating new position
  await positionModel.create({
    nazwa,
    opis,
  });

  return;
};

// ================================
//         DELETE REQUESTS
// ================================

export const deletePosition = async (stanowisko_id: number) => {
  const deletedPosition: Stanowisko = await positionModel.deleteWithId(
    stanowisko_id
  );

  if (!deletedPosition) {
    throw new Error("Position was not deleted.");
  }

  return;
};

// ================================
//         PUT REQUESTS
// ================================
export const updatePosition = async (positionData: Stanowisko) => {
  return await positionModel.update(positionData);
};
