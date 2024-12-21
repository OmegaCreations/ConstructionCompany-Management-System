import * as resourceModel from "../models/resourceModel";
import { Zasob } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all resources
export const getAllResources = async () => {
  return (await resourceModel.getAll()) as Zasob[];
};
