import { Request, Response } from "express";
import { createNewUser, getUserData } from "../services/userService";

// gets user's data
export const getUser: any = async (req: any, res: Response) => {
  const userId = req.user.pracownik_id;

  if (!userId) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const userData = await getUserData(userId);
    return res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during fetching user data.",
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
      error: err instanceof Error ? err.message : "Error during user creation.",
    });
  }
};
