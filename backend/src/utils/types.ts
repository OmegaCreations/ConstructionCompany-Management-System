// db returning user type interface
export interface Pracownik {
  pracownik_id: number;
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  stawka_godzinowa: number;
  stanowisko_id: number;
  stanowisko_nazwa: string;
}

export interface AuthPracownik extends Pracownik {
  haslo: string;
}

// db returning paycheck type interface
export interface Paycheck {
  przepracowane_godziny: number;
  wyplata_status: number | null;
}

// db returning user type interface
export interface Klient {
  klient_id: number;
  imie: string;
  nazwisko: string;
  firma: string;
  telefon: string;
  email: string;
  adres: string;
}

// OTHER
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
