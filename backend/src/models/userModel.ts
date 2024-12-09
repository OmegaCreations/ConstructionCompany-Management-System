import { QueryResult } from "pg";
import "../utils/types";
import { client } from "../config/db";

interface CreateUserInput {
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  haslo: string;
  stawka_godzinowa: number;
  stanowisko_id: number;
}

// finding user with given email address
export const findUserByEmail = async (email: string) => {
  const query = "SELECT * FROM pracownik WHERE email = $1";
  const result: QueryResult<Pracownik> = await client.query(query, [email]);
  return result.rows[0];
};

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
