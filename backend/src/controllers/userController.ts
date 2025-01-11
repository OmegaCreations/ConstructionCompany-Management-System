import { Request, Response } from "express";
import * as userService from "../services/userService";
import { Paycheck } from "../utils/types";
import { getRoleByPositionId } from "../utils/appTypes";

// ================================
//        GET REQUESTS
// ================================

// gets all user's data
export const getAllUsers: any = async (req: any, res: Response) => {
  try {
    const userData = await userService.getAllUsers();
    return res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during fetching users.",
    });
  }
};

// gets user's data
export const getUser: any = async (req: any, res: Response) => {
  const pracownik_id = req.user.pracownik_id; // authenticated user id
  const request_pracownik_id = Number(req.params.id); // requested user id in url

  if (!pracownik_id || !request_pracownik_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const userData = await userService.getUser(request_pracownik_id);
    return res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during fetching user data.",
    });
  }
};

// gets user's paycheck for current month
export const getUserPaycheck: any = async (req: any, res: Response) => {
  const pracownik_id: number = req.user.pracownik_id;
  const request_pracownik_id: number = Number(req.params.id);

  if (
    !pracownik_id ||
    !request_pracownik_id ||
    // if its not manager we want user to only access his own paycheck data
    (getRoleByPositionId(req.user.stanowisko_id) === "worker" &&
      pracownik_id !== request_pracownik_id)
  ) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const payckeck: Paycheck = await userService.getUserPaychckeck(
      request_pracownik_id
    );
    return res.status(200).json(payckeck);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching user's paycheck.",
    });
  }
};

// ================================
//        POST REQUESTS
// ================================

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
    const generated_password = await userService.createNewUser({
      imie,
      nazwisko,
      telefon,
      email,
      stawka_godzinowa,
      stanowisko_id,
    });

    res.status(201).json({
      ...generated_password,
      info: "Zapamiętaj to hasło i przekaż swojemu pracownikowi",
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Error during user creation.",
    });
  }
};

// ================================
//           PUT REQUESTS
// ================================

export const updateUser: any = async (req: Request, res: Response) => {
  const {
    pracownik_id,
    imie,
    nazwisko,
    telefon,
    email,
    stawka_godzinowa,
    stanowisko_id,
    stanowisko_nazwa,
  } = req.body;

  if (!pracownik_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await userService.updateUser({
      pracownik_id,
      imie,
      nazwisko,
      telefon,
      email,
      stawka_godzinowa,
      stanowisko_id,
      stanowisko_nazwa,
    });

    res.status(201).json({
      info: "Pracownik został zaktualizowany!",
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Error during User updating.",
    });
  }

  return;
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteUser: any = async (req: any, res: Response) => {
  const { pracownik_id } = req.body;
  const user_pracownik_id: number = req.user.pracownik_id;

  if (!pracownik_id) {
    return res.status(400).json({ error: "Please provide all the data." });
  } else if (user_pracownik_id === pracownik_id) {
    return res.status(400).json({ error: "You can't delete yourself." });
  }

  try {
    await userService.deleteUser(Number(pracownik_id));

    res.status(201).json({
      info: "Pracownik został usunięty!",
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Error during User deleting.",
    });
  }

  return;
};
