import { QueryResult } from "pg";
import { client } from "../config/db";
import { Zasob } from "../utils/types";

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
