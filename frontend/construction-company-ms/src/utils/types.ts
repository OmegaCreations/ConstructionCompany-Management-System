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

export const initialClientState = {
  klient_id: -1,
  imie: "",
  nazwisko: "",
  firma: "",
  telefon: "",
  email: "",
  adres: "",
};

// order data
export interface OrderData {
  zlecenie_id: number;
  klient_imie: string;
  klient_nazwisko: string;
  klient_firma: string;
  klient_id: number;
  opis: string;
  data_zlozenia: string;
  data_rozpoczenia: string;
  data_zakonczenia: string;
  lokalizacja: string;
}

export const initialOrderState: OrderData = {
  zlecenie_id: -1,
  klient_imie: "",
  klient_nazwisko: "",
  klient_firma: "",
  klient_id: -1,
  opis: "",
  data_zlozenia: "",
  data_rozpoczenia: "",
  data_zakonczenia: "",
  lokalizacja: "",
};

export interface OrderCosts {
  liczba_pracownikow: number;
  przepracowane_godziny: number;
  koszty_pracownikow: number;
  koszty_zasobow: number;
}

// WORKDAY DATA
export interface WorkDay {
  pracownik_id: number;
  zlecenie_id: number;
  opis_pracownika: string;
  opis_managera: string;
  data: string;
  godzina_rozpoczecia: string | null;
  godzina_zakonczenia: string | null;
  pracownik_imie: string;
  pracownik_nazwisko: string;
  zlecenie_opis: string;
  zlecenie_lokalizacja: string;
  klient_imie: string;
  klient_nazwisko: string;
  klient_firma: string;
}

// position data
export interface Position {
  stanowisko_id: number;
  nazwa: string;
  opis: string;
}

export const initialPositionState: Position = {
  stanowisko_id: -1,
  nazwa: "",
  opis: "",
};

// warehouse data
export interface Warehouse {
  magazyn_id: number;
  nazwa: string;
  lokalizacja: string;
}

export const initialWarehouseState: Warehouse = {
  magazyn_id: -1,
  nazwa: "",
  lokalizacja: "",
};

// Resource data
export interface Resource {
  zasob_id: number;
  nazwa: string;
  jednostka: string;
  typ: "material" | "sprzet";
  opis: string;
  koszt_jednostkowy: number;
  ilosc: number;
}

export const initialResourceState: Resource = {
  zasob_id: -1,
  nazwa: "",
  jednostka: "",
  typ: "material",
  opis: "",
  koszt_jednostkowy: 0,
  ilosc: 0,
};

// shopping list data
export interface ShoppingList {
  nazwa_zasobu: string;
  koszt_jednostkowy: number;
  ilosc: number;
  suma_kosztow: number;
  nazwa_firmy: string;
  data_rozpoczecia: string;
  opis_zlecenia: string;
}

export const initialShoppingListState: ShoppingList = {
  nazwa_zasobu: "",
  koszt_jednostkowy: 0,
  ilosc: 0,
  suma_kosztow: 0,
  nazwa_firmy: "",
  data_rozpoczecia: "",
  opis_zlecenia: "",
};
