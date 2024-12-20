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

// returns existing user
export const getUserData = async (userId: number) => {
  const existingUser: Pracownik | null = await userModel.findUserById(userId);
  if (!existingUser) {
    throw new Error("User with given credentials does not exist.");
  }

  // we dont wanna return to frontend important info about db architecture
  return (({ haslo, stanowisko_id, pracownik_id, ...obj }) => obj)(
    existingUser
  );
};

// updates user's data
export const updateUserData = async (userData: updateUserInput) => {
  const updatedUser = await userModel.update(userData);
};

// creates new user
export const createNewUser = async (userData: CreateUserInput) => {
  const { imie, nazwisko, telefon, stawka_godzinowa, email, stanowisko_id } =
    userData;

  // check if user already exists
  const existingUser: Pracownik | null = await userModel.findUserByEmail(email);
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
