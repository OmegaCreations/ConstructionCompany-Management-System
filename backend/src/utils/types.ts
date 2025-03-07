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

// db returning client type interface
export interface Klient {
  klient_id: number;
  imie: string;
  nazwisko: string;
  firma: string;
  telefon: string;
  email: string;
  adres: string;
}

// db returning order type interface
export interface Zlecenie {
  zlecenie_id: number;
  klient_imie: string;
  klient_nazwisko: string;
  klient_firma: string;
  opis: string;
  wycena?: number | null;
  data_zlozenia: string;
  data_rozpoczecia: string;
  data_zakonczenia: string;
  lokalizacja: string;
}

export interface ZlecenieUpdate {
  zlecenie_id: number;
  klient_id: string;
  wycena: string;
  opis: string;
  data_zlozenia: string;
  data_rozpoczecia: string;
  data_zakonczenia: string;
  lokalizacja: string;
}

// db returning items type for order interface
export interface ZlecenieZasob {
  zlecenie_id: number;
  zasob_id: number;
  nazwa_zasobu: string;
  jednostka: string;
  typ: string;
  koszt_jednostkowy: number;
  ilosc_potrzebna: number;
  ilosc_w_magazynie: number;
}

export interface ZlecenieZasobUpdate {
  zlecenie_id: number;
  zasob_id: number;
  ilosc_potrzebna: number;
}

// needed costs for the specific order
export interface ZlecenieKoszty {
  liczba_pracownikow: number;
  przepracowane_godziny: number;
  koszty_pracownikow: number;
  koszty_zasobow: number;
}

// db returning workday type for user
export interface DzienPracy {
  pracownik_id: number;
  zlecenie_id: number;
  data: string;
  opis_pracownika: string;
  opis_managera: string;
  godzina_rozpoczecia: string;
  godzina_zakonczenia: string;
  pracownik_imie: string;
  pracownik_nazwisko: string;
  zlecenie_opis: string;
  zlecenie_lokalizacja: string;
  klient_imie: string;
  klient_nazwisko: string;
  klient_firma: string;
}

export interface DzienPracyUpdate {
  pracownik_id: number;
  zlecenie_id: number;
  data: string;
  opis_pracownika: string;
  opis_managera: string;
  godzina_rozpoczecia: string;
  godzina_zakonczenia: string;
}

// db returning warehouse type
export interface Magazyn {
  magazyn_id: number;
  nazwa: string;
  lokalizacja: string;
}

// db returning resource type for specific warehouse
// ! for non-authorized worker view !
export interface MagazynZasob {
  magazyn_zasob_id: number;
  zasob_id: number;
  nazwa_zasobu: string;
  jednostka: string;
  typ: string;
  ilosc: number;
  opis: string;
}

export interface MagazynZasobUpdate {
  magazyn_zasob_id: number;
  ilosc: number;
  magazyn_id: number;
  zasob_id: number;
}

// db returning resource type for specific warehouse
// ! for authorized view !
export interface MagazynZasobExtended extends MagazynZasob {
  koszt_jednostkowy: number;
}

// db returning resource type for specific position
export interface Stanowisko {
  stanowisko_id: number;
  nazwa: string;
  opis: string;
}

// db returning resource type for specific resource
export interface Zasob {
  zasob_id: number;
  nazwa: string;
  jednostka: string;
  typ: string;
  opis: string;
  koszt_jednostkowy: number;
}

export interface Zakupy {
  nazwa_zasobu: string;
  koszt_jednostkowy: number;
  ilosc: number;
  suma_kosztow: number;
  nazwa_firmy: string;
  data_rozpoczecia: string;
  opis_zlecenia: string;
}

// ===================================
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

export interface CreateClientInput {
  imie: string;
  nazwisko: string;
  firma: string;
  telefon: string;
  email: string;
  adres: string;
}

export interface CreatePositionInput {
  nazwa: string;
  opis: string;
}

export interface CreateResourceInput {
  nazwa: string;
  jednostka: string;
  typ: string;
  koszt_jednostkowy: number;
  opis: string;
}

export interface CreateWarehouseInput {
  nazwa: string;
  lokalizacja: string;
}

export interface CreateWarehouseResourceInput {
  ilosc: number;
  magazyn_id: number;
  zasob_id: number;
}

export interface CreateOrderInput {
  klient_id: number;
  opis: string;
  data_zlozenia: string;
  data_rozpoczecia: string;
  lokalizacja: string;
  wycena: number;
  data_zakonczenia: string | null;
}

export interface CreateOrderResourceInput {
  zlecenie_id: number;
  zasob_id: number;
  ilosc_potrzebna: number;
}

export interface CreateWorkdayInput {
  pracownik_id: number;
  zlecenie_id: number;
  data: number;
  opis_managera: string | null;
}
