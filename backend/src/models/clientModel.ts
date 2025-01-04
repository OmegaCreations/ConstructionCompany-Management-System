import { QueryResult } from "pg";
import { client } from "../config/db";
import { CreateClientInput, Klient } from "../utils/types";

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

// find client with given email address
// returns Klient type
export const findByEmail = async (email: string) => {
  const query =
    "SELECT k.klient_id, k.imie, k.nazwisko, k.firma, k.telefon, k.email, k.adres FROM klient k WHERE email = $1";
  const result: QueryResult<Klient> = await client.query(query, [email]);
  return result.rows[0];
};

// ================================
//        POST REQUESTS
// ================================
export const create = async (clientData: CreateClientInput) => {
  // input data to db query
  const { imie, nazwisko, firma, telefon, email, adres } = clientData;
  const query = `INSERT INTO klient (imie, nazwisko, firma, telefon, email, adres) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

  const result: QueryResult<Klient> = await client.query(query, [
    imie,
    nazwisko,
    firma,
    telefon,
    email,
    adres,
  ]);
  return result.rows[0]; // return back newly created client
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (klient_id: number) => {
  const query = `DELETE FROM klient WHERE klient_id = $1 returning *`;
  const result: QueryResult<Klient> = await client.query(query, [klient_id]);
  return result.rows[0];
};
