import { QueryResult } from "pg";
import { client } from "../config/db";
import { CreatePositionInput, Stanowisko } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all positions
// returns Stanowisko[] type
export const getAll = async () => {
  const query = "select * from get_stanowiska()";
  const result: QueryResult<Stanowisko> = await client.query(query, []);
  return result.rows;
};

// finds position by name
export const findByName = async (nazwa: string) => {
  const query = "select * from stanowisko where nazwa = $1";
  const result: QueryResult<Stanowisko> = await client.query(query, [nazwa]);
  return result.rows[0];
};

// ================================
//         POST REQUESTS
// ================================

// creates new position in database
export const create = async (positionData: CreatePositionInput) => {
  const { nazwa, opis } = positionData;
  const query = `INSERT INTO stanowisko 
        (nazwa, opis) 
    VALUES ($1, $2) RETURNING *`;

  const result: QueryResult<Stanowisko> = await client.query(query, [
    nazwa,
    opis,
  ]);
  return result.rows[0]; // return back newly created position
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (stanowisko_id: number) => {
  const query = `DELETE FROM stanowisko WHERE stanowisko_id = $1 returning *`;
  const result: QueryResult<Stanowisko> = await client.query(query, [
    stanowisko_id,
  ]);
  return result.rows[0];
};

// ================================
//         PUT REQUESTS
// ================================
export const update = async (stanowiskoData: Stanowisko) => {
  const { stanowisko_id, nazwa, opis } = stanowiskoData;
  const query = `SELECT update_stanowisko($1, $2, $3)`;
  const result: QueryResult<Stanowisko> = await client.query(query, [
    stanowisko_id,
    nazwa,
    opis,
  ]);
  return result.rows[0];
};
