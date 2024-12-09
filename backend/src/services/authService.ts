import * as userModel from "../models/userModel";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getRoleByPositionId } from "../utils/appTypes";

dotenv.config();
const JWT_SECRET = String(process.env.JWT_SECRET); // secret key for JWT

// login user and send back generated token
export const loginUser = async (email: string, haslo: string) => {
  const user = await userModel.findUserByEmail(email); // if found returns "pracownik" object from db

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  // we check if encrytped passwords match each other
  const isPasswordValid = await bcrypt.compare(haslo, user.haslo);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials.");
  }

  // singing new token
  const token = jwt.sign(
    { pracownik_id: user.pracownik_id, stanowisko_id: user.stanowisko_id },
    JWT_SECRET,
    {
      expiresIn: "1h", // jwt expire time
    }
  );

  const role = getRoleByPositionId(user.stanowisko_id);
  return { token, role };
};

// verify token sent by user
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET); // jwt verify returns a decoded object that we stored the token in {pracownik_id, stanowisko_id}
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error("User with given credentials does not exists.");
  }

  // check current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.haslo);
  if (!isPasswordValid) {
    throw new Error("Incorrect credentials.");
  }

  // Hashowanie nowego hasła
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Aktualizacja hasła
  await userModel.updatePassword(userId, hashedPassword);
};

// interface for user's data
interface CreateUserInput {
  imie: string;
  nazwisko: string;
  telefon: string;
  stawka_godzinowa: number;
  email: string;
  stanowisko_id: number;
}

// creates new user
export const createNewUser = async (userData: CreateUserInput) => {
  const { imie, nazwisko, telefon, stawka_godzinowa, email, stanowisko_id } =
    userData;

  // check if user already exists
  const existingUser = await userModel.findUserByEmail(email);
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
