import { Request, Response } from "express";
import {
  loginUser,
  createNewUser,
  updatePassword,
} from "../services/authService";

// controller for logging in user
export const userLogin: any = async (req: Request, res: Response) => {
  const { email, haslo } = req.body;

  // checks if any data is passed
  if (!email || !haslo) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // tries to log in with credentials
  try {
    const { token, role } = await loginUser(email, haslo);
    res.json({ token, role });
  } catch (err) {
    res
      .status(401)
      .json({ error: err instanceof Error ? err.message : "Unauthorized" });
  }
};

// changes user's password
export const changeUserPassword: any = async (req: any, res: Response) => {
  const userId = req.user.pracownik_id; // get user id
  const { currentPassword, newPassword } = req.body;

  // check if data is passed properly
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password has been changed." });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during changing password",
    });
  }
};

// creates new user
export const createUser: any = async (req: Request, res: Response) => {
  // password will be generated
  const { imie, nazwisko, telefon, email, stawka_godzinowa, stanowisko_id } =
    req.body;

  // check if required data was passed
  if (
    !imie ||
    !nazwisko ||
    !email ||
    !telefon ||
    !stawka_godzinowa ||
    !stanowisko_id
  ) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  // creating new user
  try {
    const newUser = await createNewUser({
      imie,
      nazwisko,
      telefon,
      email,
      stawka_godzinowa,
      stanowisko_id,
    });

    res.status(201).json({ message: "User created.", user: newUser });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Error during user creation",
    });
  }
};
