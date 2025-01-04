import { QueryResult } from "pg";
import { client } from "../config/db";
import { CreateWorkdayInput, DzienPracy } from "../utils/types";

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

// returns worked hours for this month
export const getHoursWorked = async (pracownik_id: number) => {
  const query = `
    SELECT EXTRACT(HOUR FROM get_summed_work_hours) + EXTRACT(DAY FROM get_summed_work_hours) * 24 + EXTRACT(MINUTE FROM get_summed_work_hours) / 60 AS hours
    FROM get_summed_work_hours($1);
  `;
  const result = (await client.query(query, [pracownik_id])).rows[0];
  const hoursWorked = result.hours;
  return { total_hours: hoursWorked };
};

// ================================
//        POST REQUESTS
// ================================

// creates new workday in database
export const create = async (data: CreateWorkdayInput[]) => {
  for (let workday of data) {
    const { pracownik_id, zlecenie_id, data, opis_managera } = workday;
    const query = `select dodaj_dzien_pracy($1, $2, $3, $4)`;
    await client.query(query, [pracownik_id, zlecenie_id, data, opis_managera]);
  }

  return;
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (
  pracownik_id: number,
  zlecenie_id: number,
  data: string
) => {
  const query = `DELETE FROM dzien_pracy 
                  WHERE pracownik_id = $1 AND zlecenie_id = $2 AND data = $3;
                 returning *`;
  const result: QueryResult<DzienPracy> = await client.query(query, [
    pracownik_id,
    zlecenie_id,
    data,
  ]);

  return result.rows[0];
};
