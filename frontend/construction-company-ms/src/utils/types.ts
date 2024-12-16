// User data
export interface UserData {
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  stawka_godzinowa: number;
  rola: string | null;
  stanowisko: string;
}

export const initialUserState: UserData = {
  imie: "",
  nazwisko: "",
  telefon: "",
  email: "",
  stawka_godzinowa: 0,
  rola: null,
  stanowisko: "",
};
