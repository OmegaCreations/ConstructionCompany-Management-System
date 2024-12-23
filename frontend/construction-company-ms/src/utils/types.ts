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

// client data
export interface ClientData {
  klient_id: number;
  imie: string;
  nazwisko: string;
  firma: string;
  telefon: string;
  email: string;
  adres: string;
}

// order data
export interface OrderData {
  zlecenie_id: number;
  klient_imie: string;
  klient_nazwisko: string;
  klient_firma: string;
  opis: string;
  data_zlozenia: string;
  data_rozpoczenia: string;
  data_zakonczenia: string;
  lokalizacja: string;
}

export interface OrderCosts {
  liczba_pracownikow: number;
  przepracowane_godziny: number;
  koszty_pracownikow: number;
  koszty_zasobow: number;
}
