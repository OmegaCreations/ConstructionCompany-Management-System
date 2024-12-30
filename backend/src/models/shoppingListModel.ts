import { QueryResult } from "pg";
import { client } from "../config/db";
import { Zakupy } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// finds shopping list by date
export const findByDate = async (data: string) => {
  const query = "select * from get_zakupy($1)";
  const result: QueryResult<Zakupy> = await client.query(query, [data]);
  return result.rows;
};
