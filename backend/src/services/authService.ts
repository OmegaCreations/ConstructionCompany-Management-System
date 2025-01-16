import * as userModel from "../models/userModel";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getRoleByPositionId } from "../utils/appTypes";
import { AuthPracownik } from "../utils/types";
import { accessTokenExpire, refreshTokenExpire } from "../utils/appTestConfig";

dotenv.config();
const JWT_SECRET = String(process.env.JWT_SECRET); // secret key for JWT
const JWT_REFRESH_SECRET = String(process.env.JWT_REFRESH_SECRET); // for refresh token

// login user and send back generated token
export const loginUser = async (email: string, haslo: string) => {
  const user: AuthPracownik = await userModel.findByEmail(email); // if found returns "pracownik" object from db

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
      expiresIn: accessTokenExpire, // jwt expire time
    }
  );

  const refreshToken = jwt.sign(
    { pracownik_id: user.pracownik_id, stanowisko_id: user.stanowisko_id },
    JWT_REFRESH_SECRET,
    {
      expiresIn: refreshTokenExpire,
    }
  );

  console.log("token:", token, "\nrefresh token:", refreshToken);

  const role = getRoleByPositionId(user.stanowisko_id);
  return { token, refreshToken, role, pracownik_id: user.pracownik_id };
};

export const refreshToken = (refreshToken: string) => {
  const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
  console.log(user.pracownik_id);
  const token = jwt.sign(
    { pracownik_id: user.pracownik_id, stanowisko_id: user.stanowisko_id },
    JWT_SECRET,
    { expiresIn: accessTokenExpire }
  );

  const role = getRoleByPositionId(user.stanowisko_id);
  return { token, role, pracownik_id: user.pracownik_id };
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
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User with given credentials does not exists.");
  }

  // check current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    (user as AuthPracownik).haslo
  );
  if (!isPasswordValid) {
    throw new Error("Incorrect credentials.");
  }

  // Hashowanie nowego hasła
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Aktualizacja hasła
  await userModel.updatePassword(userId, hashedPassword);
};
