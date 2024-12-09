import { Request, Response } from "express";
import { loginUser, createNewUser } from "../services/authService";

// controller for logging in user
export const userLogin: any = async (req: Request, res: Response) => {
  const { email, haslo } = req.body;

  // checks if any data is passed
  if (!email || !haslo) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // tries to log in with credentials
  try {
    const { token } = await loginUser(email, haslo);
    res.json({ token });
  } catch (err) {
    res
      .status(401)
      .json({ error: err instanceof Error ? err.message : "Unauthorized" });
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
    return res
      .status(400)
      .json({ error: "Proszę podać wszystkie wymagane dane." });
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
