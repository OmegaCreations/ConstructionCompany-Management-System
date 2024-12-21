import { QueryResult } from "pg";
import { client } from "../config/db";
import { Stanowisko } from "../utils/types";

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
