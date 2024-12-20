import { QueryResult } from "pg";
import { client } from "../config/db";
import { Magazyn, MagazynZasob, MagazynZasobExtended } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all warehouses
// returns Magazyn[] type
export const getAll = async () => {
  const query = "select * from get_magazyny()";
  const result: QueryResult<Magazyn> = await client.query(query, []);
  return result.rows;
};

// Finds all resources for specific warehouse with extended view as an authorized user
// returns MagazynZasobExtended[] type
export const getResourcesAsManager = async (magazyn_id: number) => {
  const query = "select * from get_zasoby_magazynu($1)";
  const result: QueryResult<MagazynZasobExtended> = await client.query(query, [
    magazyn_id,
  ]);
  return result.rows;
};

// Finds all resources for specific warehouse with view as an un-authorized user
// returns MagazynZasob[] type
export const getResourcesAsWorker = async (magazyn_id: number) => {
  const query = "select * from get_zasoby_magazynu_pracownik($1)";
  const result: QueryResult<MagazynZasob> = await client.query(query, [
    magazyn_id,
  ]);
  return result.rows;
};
