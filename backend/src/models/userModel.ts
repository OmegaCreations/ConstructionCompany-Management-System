import { QueryResult } from "pg";
import { client } from "../config/db";
import {
  AuthPracownik,
  CreateUserInput,
  Paycheck,
  Pracownik,
  updateUserInput,
} from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// finding all user's
// returns Pracownik[] type
export const getAll = async () => {
  const query = "select * from get_pracownicy()";
  const result: QueryResult<Pracownik> = await client.query(query, []);
  return result.rows;
};

// find user with given pracownik_id
// returns Pracownik type
export const findById = async (pracownik_id: number) => {
  const query = "select * from get_pracownicy($1)";
  const result: QueryResult<Pracownik> = await client.query(query, [
    pracownik_id,
  ]);
  return result.rows[0];
};

// find user with given email address
// returns AuthPracownik type
export const findByEmail = async (email: string) => {
  const query =
    "SELECT p.pracownik_id, p.imie, p.nazwisko, p.telefon, p.email, p.haslo, p.stawka_godzinowa, s.stanowisko_id, s.nazwa as stanowisko_nazwa FROM pracownik p JOIN stanowisko s using(stanowisko_id) WHERE email = $1";
  const result: QueryResult<AuthPracownik> = await client.query(query, [email]);
  return result.rows[0];
};

// get user's paycheck for current month
// returns: Paycheck type
export const getPaycheckStatus = async (pracownik_id: number) => {
  const query = "select * from get_wyplata_status($1)";
  const result: QueryResult<Paycheck> = await client.query(query, [
    pracownik_id,
  ]);
  return result.rows[0];
};

// ================================
//         POST REQUESTS
// ================================

// creates new user in database
export const create = async (userData: CreateUserInput) => {
  // input data to db query
  const {
    imie,
    nazwisko,
    telefon,
    email,
    haslo,
    stawka_godzinowa,
    stanowisko_id,
  } = userData;
  const query = `INSERT INTO pracownik 
        (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  const result: QueryResult<Pracownik> = await client.query(query, [
    imie,
    nazwisko,
    telefon,
    email,
    haslo,
    stawka_godzinowa,
    stanowisko_id,
  ]);
  return result.rows[0]; // return back newly created user
};

// ================================
//          PUT REQUESTS
// ================================
export const update = async (userData: Pracownik) => {
  const {
    pracownik_id,
    imie,
    nazwisko,
    telefon,
    email,
    stawka_godzinowa,
    stanowisko_id,
    stanowisko_nazwa, // null
  } = userData;
  const query = `SELECT update_pracownik($1, $2, $3, $4, $5, $6, $7)`;
  const result: QueryResult<Pracownik> = await client.query(query, [
    pracownik_id,
    imie,
    nazwisko,
    telefon,
    email,
    stawka_godzinowa,
    stanowisko_id,
  ]);
  return result.rows[0];
};

// updates user's password
export const updatePassword = async (
  userId: number,
  newPassword: string
): Promise<void> => {
  const query = `UPDATE pracownik SET haslo = $1 WHERE pracownik_id = $2`;
  await client.query(query, [newPassword, userId]);
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWithId = async (pracownik_id: number) => {
  const query = `DELETE FROM pracownik WHERE pracownik_id = $1 returning *`;
  const result: QueryResult<Pracownik> = await client.query(query, [
    pracownik_id,
  ]);
  return result.rows[0];
};
