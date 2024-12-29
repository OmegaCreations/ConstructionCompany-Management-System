import { QueryResult } from "pg";
import { client } from "../config/db";
import { CreateResourceInput, Zasob } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all resources
// returns Zasob[] type
export const getAll = async () => {
  const query = "select * from get_zasoby()";
  const result: QueryResult<Zasob> = await client.query(query, []);
  return result.rows;
};

// finds resource by id
export const findById = async (zasob_id: number) => {
  const query = "select * from zasob where zasob_id = $1";
  const result: QueryResult<Zasob> = await client.query(query, [zasob_id]);
  return result.rows[0];
};

// ================================
//         POST REQUESTS
// ================================

// creates new resource in database
export const create = async (resourceData: CreateResourceInput) => {
  const { nazwa, jednostka, typ, opis } = resourceData;
  const query = `INSERT INTO zasob 
        (nazwa, jednostka, typ, opis) 
    VALUES ($1, $2, $3, $4) RETURNING *`;

  const result: QueryResult<Zasob> = await client.query(query, [
    nazwa,
    jednostka,
    typ,
    opis,
  ]);
  return result.rows[0]; // return back newly created resource
};
