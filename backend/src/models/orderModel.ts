import { QueryResult } from "pg";
import { client } from "../config/db";
import { Zlecenie, ZlecenieKoszty, ZlecenieZasob } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// finding all orders
// returns Zlecenie[] type
export const getAll = async () => {
  const query = "select * from get_zlecenie_info()";
  const result: QueryResult<Zlecenie> = await client.query(query, []);
  return result.rows;
};

// finding all orders for client
// returns Zlecenie[] type
export const getAllForClient = async (klient_id: number) => {
  const query = "select * from get_klient_zlecenia($1)";
  const result: QueryResult<Zlecenie> = await client.query(query, [klient_id]);
  return result.rows;
};

// Specific order's data
// returns Zlecenie type
export const findById = async (zlecenie_id: number) => {
  const query = "select * from get_zlecenie_info($1)";
  const result: QueryResult<Zlecenie> = await client.query(query, [
    zlecenie_id,
  ]);
  return result.rows[0];
};

// Returns all resource needed for specific order
// returns ZlecenieZasob[] type
export const getResources = async (zlecenie_id: number) => {
  const query = "select * from get_zlecenie_zasoby($1)";
  const result: QueryResult<ZlecenieZasob> = await client.query(query, [
    zlecenie_id,
  ]);
  return result.rows;
};

// get all costs and worker hours for specific order
// returns ZlecenieKoszty type
export const getCosts = async (zlecenie_id: number) => {
  const query_workers = "select * from get_pracownicy_koszty($1)";
  const workers_result: QueryResult<{
    liczba_pracownikow: number;
    przepracowane_godziny: number;
    koszty_pracownikow: number;
  }> = await client.query(query_workers, [zlecenie_id]);

  const query_resources = "select * from get_dodatkowe_koszty($1)";
  const resources_result: QueryResult<{ get_dodatkowe_koszty: number }> =
    await client.query(query_resources, [zlecenie_id]);

  return {
    ...workers_result.rows[0],
    koszty_zasobow: resources_result.rows[0].get_dodatkowe_koszty,
  } as ZlecenieKoszty;
};
