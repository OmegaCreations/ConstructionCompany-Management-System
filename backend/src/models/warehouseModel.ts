import { QueryResult } from "pg";
import { client } from "../config/db";
import {
  CreateWarehouseInput,
  CreateWarehouseResourceInput,
  Magazyn,
  MagazynZasob,
  MagazynZasobExtended,
} from "../utils/types";

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

// finds warehouse by name
export const findByName = async (nazwa: string) => {
  const query = "select * from magazyn where nazwa = $1";
  const result: QueryResult<Magazyn> = await client.query(query, [nazwa]);
  return result.rows[0];
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

// ================================
//         POST REQUESTS
// ================================

// creates new warehouse in database
export const create = async (warehouseData: CreateWarehouseInput) => {
  const { nazwa, lokalizacja } = warehouseData;
  const query = `INSERT INTO magazyn 
        (nazwa, lokalizacja) 
    VALUES ($1, $2) RETURNING *`;

  const result: QueryResult<Magazyn> = await client.query(query, [
    nazwa,
    lokalizacja,
  ]);
  return result.rows[0]; // return back newly created warehouse
};

// add new resource to the warehouse or add new ammount
export const addResource = async (data: CreateWarehouseResourceInput) => {
  const { ilosc, magazyn_id, zasob_id } = data;
  const query = `select dodaj_zasob_do_magazynu($1, $2, $3)`;

  return (await client.query(query, [ilosc, magazyn_id, zasob_id])).rows[0];
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (magazyn_id: number) => {
  const query = `DELETE FROM magazyn WHERE magazyn_id = $1 returning *`;
  const result: QueryResult<Magazyn> = await client.query(query, [magazyn_id]);
  return result.rows[0];
};

export const deleteResource = async (magazyn_zasob_id: number) => {
  const query = `DELETE FROM magazyn_zasob WHERE magazyn_zasob_id = $1 returning *`;
  const result: QueryResult<MagazynZasob> = await client.query(query, [
    magazyn_zasob_id,
  ]);
  return result.rows[0];
};
