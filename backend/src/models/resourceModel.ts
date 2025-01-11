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
  const { nazwa, jednostka, typ, opis, koszt_jednostkowy } = resourceData;
  const query = `INSERT INTO zasob 
        (nazwa, jednostka, typ, opis, koszt_jednostkowy) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  const result: QueryResult<Zasob> = await client.query(query, [
    nazwa,
    jednostka,
    typ,
    opis,
    koszt_jednostkowy,
  ]);
  return result.rows[0]; // return back newly created resource
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (zasob_id: number) => {
  const query = `DELETE FROM zasob WHERE zasob_id = $1 returning *`;
  const result: QueryResult<Zasob> = await client.query(query, [zasob_id]);
  return result.rows[0];
};

// ================================
//         PUT REQUESTS
// ================================

export const update = async (resourceData: Zasob) => {
  const { zasob_id, nazwa, jednostka, typ, koszt_jednostkowy, opis } =
    resourceData;
  const query = `SELECT update_zasob($1, $2, $3, $4, $5, $6)`;
  const result: QueryResult<Zasob> = await client.query(query, [
    zasob_id,
    nazwa,
    jednostka,
    typ,
    koszt_jednostkowy,
    opis,
  ]);
  return result.rows[0];
};
