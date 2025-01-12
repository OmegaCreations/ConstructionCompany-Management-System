import { Request, Response } from "express";
import * as workdayService from "../services/workdayService";
import { CreateWorkdayInput, DzienPracy } from "../utils/types";
import { getRoleByPositionId } from "../utils/appTypes";

// ================================
//        GET REQUESTS
// ================================

// returns all workdays for all users in specific month
export const getAllWorkDays: any = async (req: Request, res: Response) => {
  const year = Number(req.params.year);
  const month = Number(req.params.month);

  if (!year || !month) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const workdayData: DzienPracy[] = await workdayService.getAllWorkDays(
      year,
      month
    );
    return res.status(200).json(workdayData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching work days' data.",
    });
  }
};

// returns all workdays for specific user in specific month
export const getWorkDays: any = async (req: any, res: Response) => {
  const pracownik_id: number = req.user.pracownik_id;
  const request_pracownik_id = Number(req.params.id);
  const year = Number(req.params.year);
  const month = Number(req.params.month);

  if (
    !pracownik_id ||
    !year ||
    !month ||
    // if its not manager we want user to only access his own workdays' data
    (getRoleByPositionId(req.user.stanowisko_id) === "worker" &&
      pracownik_id !== request_pracownik_id)
  ) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const workdayData: DzienPracy[] = await workdayService.getWorkDays(
      request_pracownik_id,
      year,
      month
    );
    return res.status(200).json(workdayData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching work days' data.",
    });
  }
};

// returns one workday data for specific user in specific date
export const getSpecificWorkDay: any = async (req: any, res: Response) => {
  const pracownik_id: number = req.user.pracownik_id;
  const request_pracownik_id = Number(req.params.id);
  const year = Number(req.params.year);
  const month = Number(req.params.month);
  const day = Number(req.params.day);

  if (
    !pracownik_id ||
    !year ||
    !month ||
    !day ||
    // if its not manager we want user to only access his own workdays' data
    (getRoleByPositionId(req.user.stanowisko_id) === "worker" &&
      pracownik_id !== request_pracownik_id)
  ) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const workdayData: DzienPracy = await workdayService.getSpecificWorkDay(
      request_pracownik_id,
      year,
      month,
      day
    );
    if (!workdayData) {
      return res.status(200).json({});
    }
    return res.status(200).json(workdayData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching work day's data.",
    });
  }
};

// returns one workday data for specific user in specific date
export const getWorkedHours: any = async (req: any, res: Response) => {
  const pracownik_id: number = req.user.pracownik_id;

  console.log(req.user);

  if (!pracownik_id) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const total_hours = await workdayService.getWorkedHours(pracownik_id);
    if (!total_hours) {
      return res.status(200).json({ total_hours: 0 });
    }
    return res.status(200).json(total_hours);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching worked hours.",
    });
  }
};

// ================================
//        POST REQUESTS
// ================================

// creates new workdays
export const createNewWorkdays: any = async (req: Request, res: Response) => {
  const data: CreateWorkdayInput[] = req.body;

  // check if required data was passed
  for (let resource of data) {
    let { pracownik_id, zlecenie_id, data, opis_managera } = resource;
    if (!zlecenie_id || !pracownik_id || !data) {
      return res.status(400).json({ error: "Please provide all the data." });
    }
  }

  // adding new workdays
  try {
    await workdayService.createWorkdays(data);

    res.status(201).json({
      info: "Nowe dni pracy zostały przydzielone!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during creating workdays.",
    });
  }
};

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWorkday: any = async (req: Request, res: Response) => {
  const { pracownik_id, zlecenie_id, data } = req.body;

  if (!pracownik_id || !zlecenie_id || !data) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await workdayService.deleteWorkday(
      Number(pracownik_id),
      Number(zlecenie_id),
      String(data)
    );

    res.status(201).json({
      info: "Dzień pracy został usunięty!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Workday deleting.",
    });
  }

  return;
};

// ================================
//           PUT REQUESTS
// ================================

export const updateWorkday: any = async (req: Request, res: Response) => {
  const {
    pracownik_id,
    zlecenie_id,
    data,
    opis_pracownika,
    opis_managera,
    godzina_rozpoczecia,
    godzina_zakonczenia,
  } = req.body;
  console.log(
    pracownik_id,
    zlecenie_id,
    data.split("T")[0],
    opis_pracownika,
    opis_managera,
    godzina_rozpoczecia,
    godzina_zakonczenia
  );
  if (!pracownik_id || !zlecenie_id || !data.split("T")[0]) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  const parsedData: string = data.split("T")[0];

  try {
    await workdayService.updateWorkday({
      pracownik_id,
      zlecenie_id,
      data: parsedData,
      opis_pracownika,
      opis_managera,
      godzina_rozpoczecia,
      godzina_zakonczenia,
    });

    res.status(201).json({
      info: "Dzień pracy został zaktualizowany!",
    });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during Work day updating.",
    });
  }

  return;
};
