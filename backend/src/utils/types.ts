// db user type interface
export interface Pracownik {
  pracownik_id: number;
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  haslo: string;
  stawka_godzinowa: number;
  stanowisko_id: number;
  stanowisko: string;
}

export interface CreateUserInput {
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  haslo: string;
  stawka_godzinowa: number;
  stanowisko_id: number;
}

export interface updateUserInput {
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  stawka_godzinowa: number;
  stanowisko_id: number;
}
