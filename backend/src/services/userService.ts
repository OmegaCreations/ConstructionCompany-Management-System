import * as userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { Pracownik, updateUserInput } from "../utils/types";

// interface for user's data
interface CreateUserInput {
  imie: string;
  nazwisko: string;
  telefon: string;
  stawka_godzinowa: number;
  email: string;
  stanowisko_id: number;
}

// ================================
//        GET REQUESTS
// ================================

// returns all users
export const getAllUsers = async () => {
  return await userModel.getAll();
};

// returns existing user with pracownik_id
export const getUser = async (pracownik_id: number) => {
  const existingUser: Pracownik | null = await userModel.findById(pracownik_id);
  if (!existingUser) {
    throw new Error("User with given credentials does not exist.");
  }

  return existingUser;
};

// returns user's payckeck for current month
export const getUserPaychckeck = async (pracownik_id: number) => {
  const existingUser: Pracownik | null = await userModel.findById(pracownik_id);
  if (!existingUser) {
    throw new Error("User with given credentials does not exist.");
  }

  return await userModel.getPaycheckStatus(pracownik_id);
};

// ================================
//        POST REQUESTS
// ================================

// creates new user
export const createNewUser = async (userData: CreateUserInput) => {
  const { imie, nazwisko, telefon, stawka_godzinowa, email, stanowisko_id } =
    userData;

  // check if user already exists
  const existingUser: Pracownik | null = await userModel.findByEmail(email);
  if (existingUser) {
    throw new Error("User with given email already exists.");
  }

  // not too safe in my opinion - thats why we need to inform user to change their password
  const generated_password = Math.random().toString(36).slice(-8);

  // hashing generated password
  // 10 rounds of hashing is considered good enough with nice speed performance
  const hashedPassword = await bcrypt.hash(generated_password, 10);

  // creating new user
  const newUser = await userModel.create({
    imie,
    nazwisko,
    telefon,
    email,
    haslo: hashedPassword,
    stawka_godzinowa,
    stanowisko_id,
  });

  return { ...newUser, wygenerowane_haslo: generated_password };
};

// ================================
//        PUT REQUESTS
// ================================
// updates user's data
export const updateUser = async (userData: updateUserInput) => {
  const updatedUser = await userModel.update(userData);
  return updatedUser;
};
