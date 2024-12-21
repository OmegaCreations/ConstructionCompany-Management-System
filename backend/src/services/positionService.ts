import * as positionModel from "../models/positionModel";
import { Stanowisko } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all positions
export const getAllPositions = async () => {
  return (await positionModel.getAll()) as Stanowisko[];
};
