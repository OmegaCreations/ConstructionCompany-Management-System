import { Request, Response } from "express";
import * as workdayService from "../services/workdayService";
import { DzienPracy } from "../utils/types";
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
