import * as workdayModel from "../models/workdayModel";
import * as userModel from "../models/userModel";
import {
  CreateWorkdayInput,
  DzienPracy,
  DzienPracyUpdate,
  Pracownik,
} from "../utils/types";

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

// ================================
//         DELETE REQUESTS
// ================================

export const deleteWorkday = async (
  pracownik_id: number,
  zlecenie_id: number,
  data: string
) => {
  const deletedWorkday: DzienPracy = await workdayModel.deleteWithId(
    pracownik_id,
    zlecenie_id,
    data
  );

  if (!deletedWorkday) {
    throw new Error("Workday was not deleted.");
  }

  return;
};

// ================================
//        PUT REQUESTS
// ================================

export const updateWorkday = async (workdayData: DzienPracyUpdate) => {
  return await workdayModel.update(workdayData);
};
