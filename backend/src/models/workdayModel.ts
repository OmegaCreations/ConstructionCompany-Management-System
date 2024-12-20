import { QueryResult } from "pg";
import { client } from "../config/db";
import { DzienPracy } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Finds all workdays for all users
// returns DzienPracy[] type
export const getAllByMonthAndYear = async (year: number, month: number) => {
  const query = "select * from get_dzienpracy_by_month($1, $2, null)";
  const result: QueryResult<DzienPracy> = await client.query(query, [
    year,
    month,
  ]);
  return result.rows;
};

// Finds all workdays for specific user
// returns DzienPracy[] type
export const getByMonthAndYear = async (
  pracownik_id: number,
  year: number,
  month: number
) => {
  const query = "select * from get_dzienpracy_by_month($1, $2, $3)";
  const result: QueryResult<DzienPracy> = await client.query(query, [
    year,
    month,
    pracownik_id,
  ]);
  return result.rows;
};

// Finds workday for specific day and specific user
// returns DzienPracy type
export const getByFullDate = async (
  pracownik_id: number,
  year: number,
  month: number,
  day: number
) => {
  const query = "select * from get_dzienpracy_by_date($1, $2, $3, $4)";
  const result: QueryResult<DzienPracy> = await client.query(query, [
    pracownik_id,
    year,
    month,
    day,
  ]);
  return result.rows[0];
};
