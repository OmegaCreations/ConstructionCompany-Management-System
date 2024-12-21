// User data
export interface UserData {
  pracownik_id: number;
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  stawka_godzinowa: number;
  stanowisko_id: number;
  stanowisko_nazwa: string;
  rola: string | null;
}

export const initialUserState: UserData = {
  pracownik_id: -1,
  imie: "",
  nazwisko: "",
  telefon: "",
  email: "",
  stawka_godzinowa: 0,
  stanowisko_id: -1,
  stanowisko_nazwa: "",
  rola: null,
};
