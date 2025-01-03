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
