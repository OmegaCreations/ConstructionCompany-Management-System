import { QueryResult } from "pg";
import { client } from "../config/db";
import {
  CreateOrderInput,
  CreateOrderResourceInput,
  Zlecenie,
  ZlecenieKoszty,
  ZlecenieUpdate,
  ZlecenieZasob,
  ZlecenieZasobUpdate,
} from "../utils/types";

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

// Get future profits
export const getProfits = async () => {
  const query = "select * from get_zyski()";
  return (await client.query(query, [])).rows[0];
};

// ================================
//         POST REQUESTS
// ================================

// creates new order in database
export const create = async (orderData: CreateOrderInput) => {
  const {
    klient_id,
    opis,
    data_zlozenia,
    data_rozpoczenia,
    lokalizacja,
    wycena,
    data_zakonczenia,
  } = orderData;
  const query = `SELECT dodaj_zlecenie($1, $2, $3, $4, $5, $6, $7);`;

  return (
    await client.query(query, [
      klient_id,
      opis,
      data_zlozenia,
      data_rozpoczenia,
      lokalizacja,
      wycena,
      data_zakonczenia,
    ])
  ).rows[0];
};

// add new resources to the order or add new ammount
export const addResource = async (data: CreateOrderResourceInput) => {
  const { zlecenie_id, zasob_id, ilosc_potrzebna } = data;
  const query = `select dodaj_zasob_do_zlecenia($1, $2, $3)`;
  await client.query(query, [zlecenie_id, zasob_id, ilosc_potrzebna]);

  return;
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (zlecenie_id: number) => {
  const query = `DELETE FROM zlecenie WHERE zlecenie_id = $1 returning *`;
  const result: QueryResult<Zlecenie> = await client.query(query, [
    zlecenie_id,
  ]);
  return result.rows[0];
};

export const deleteResource = async (zasob_id: number, zlecenie_id: number) => {
  const query = `DELETE FROM zasob_zlecenie 
                  WHERE zasob_id = $1 AND zlecenie_id = $2;
                 returning *`;
  const result: QueryResult<ZlecenieZasob> = await client.query(query, [
    zasob_id,
    zlecenie_id,
  ]);
  return result.rows[0];
};

// ================================
//         PUT REQUESTS
// ================================
export const update = async (zlecenieData: ZlecenieUpdate) => {
  const {
    zlecenie_id,
    klient_id,
    wycena,
    opis,
    data_zlozenia,
    data_rozpoczenia,
    data_zakonczenia,
    lokalizacja,
  } = zlecenieData;
  const query = `SELECT update_zlecenie($1, $2, $3, $4, $5, $6, $7, $8)`;
  const result: QueryResult<ZlecenieUpdate> = await client.query(query, [
    zlecenie_id,
    klient_id,
    wycena,
    opis,
    data_zlozenia,
    data_rozpoczenia,
    data_zakonczenia,
    lokalizacja,
  ]);
  console.log("Result: ", result);
  return result.rows[0];
};

export const updateResource = async (zasobData: ZlecenieZasobUpdate) => {
  const { zasob_id, zlecenie_id, ilosc_potrzebna } = zasobData;
  const query = `SELECT update_zasob_zlecenie($1, $2, $3)`;
  const result: QueryResult<ZlecenieZasob> = await client.query(query, [
    zasob_id,
    zlecenie_id,
    ilosc_potrzebna,
  ]);
  return result.rows[0];
};
