import * as workdayModel from "../models/workdayModel";
import * as userModel from "../models/userModel";
import { CreateWorkdayInput, DzienPracy, Pracownik } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// returns all workdays for all users in specific month
export const getAllWorkDays = async (year: number, month: number) => {
  return (await workdayModel.getAllByMonthAndYear(year, month)) as DzienPracy[];
};

// returns all workdays for specific user in specific month
export const getWorkDays = async (
  pracownik_id: number,
  year: number,
  month: number
) => {
  const existingUser: Pracownik | null = await userModel.findById(pracownik_id);
  if (!existingUser) {
    throw new Error("User with given credentials does not exist.");
  }

  return (await workdayModel.getByMonthAndYear(
    pracownik_id,
    year,
    month
  )) as DzienPracy[];
};

// returns one workday data for specific user in specific date
export const getSpecificWorkDay = async (
  pracownik_id: number,
  year: number,
  month: number,
  day: number
) => {
  const existingUser: Pracownik | null = await userModel.findById(pracownik_id);
  if (!existingUser) {
    throw new Error("User with given credentials does not exist.");
  }

  return (await workdayModel.getByFullDate(
    pracownik_id,
    year,
    month,
    day
  )) as DzienPracy;
};

// returns full worked hours for specific month and user
export const getWorkedHours = async (pracownik_id: number) => {
  const existingUser: Pracownik | null = await userModel.findById(pracownik_id);
  if (!existingUser) {
    throw new Error("User with given credentials does not exist.");
  }

  return await workdayModel.getHoursWorked(pracownik_id);
};

// ================================
//        POST REQUESTS
// ================================

// creates new workdays
export const createWorkdays = async (data: CreateWorkdayInput[]) => {
  return await workdayModel.create(data);
};
