import { QueryResult } from "pg";
import { client } from "../config/db";
import { Klient } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// finding all clients
// returns Klient[] type
export const getAll = async () => {
  const query = "select * from get_klienci()";
  const result: QueryResult<Klient> = await client.query(query, []);
  return result.rows;
};

// find client with given client_id
// returns Klient type
export const findById = async (klient_id: number) => {
  const query = "select * from get_klienci($1)";
  const result: QueryResult<Klient> = await client.query(query, [klient_id]);
  return result.rows[0];
};
