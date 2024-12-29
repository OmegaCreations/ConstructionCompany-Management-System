# Opis endpointów backendu

Poniżej znajdą Państwo opis wszystkich endpoint'ów potrzebnych do zaimplementowania pełni funkcjonalności aplikacji.

✅ - zaimplementowane w całym backendzie
☑️ - zaimplementowane na frontendzie
🧪 - przetestowane w Postman'ie

## ZAPYTANIA GET

### Użytkownik

#### Zapytania DB

- `select * from get_pracownicy(int/null);`
- `select * from get_wyplata_status(pracownik_id);` - aktualny stan wyplaty na ten miesiac

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/user" - zwraca informacje o wszystkich użytkownikach
- ✅🧪 - "http://localhost:5000/api/user/:id" - zwraca informacje o konkretnym użytkowniku
- ✅🧪 - "http://localhost:5000/api/user/:id/paycheck" - zwraca informacje o wypłacie konkretnego użytkownika

### Klient

#### Zapytania DB

- `select * from get_klienci(int/null);`

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/client" - zwraca informacje o wszystkich klientach
- ✅🧪☑️ - "http://localhost:5000/api/client/:id" - zwraca informacje o konkretnym kliencie

### Zlecenie

#### Zapytania DB

- `select * from get_klient_zlecenia(klient_id);` - zlecenia klienta
- `select * from get_zlecenie_info(zlecenie_id/null);` - informacje o zleceniu lub wszystkich zleceniach
- `select * from get_zlecenie_zasoby(zlecenie_id);` - informacje o wszystkich zasobach przypisanych dla zlecenia
- `select * from get_pracownicy_koszty(zlecenie_id);` - koszty utrzymania pracowników dla danego zlecenia
- `select * from get_dodatkowe_koszty(zlecenie_id);` - dodatkowe koszty brakujących materiałów dla zlecenia

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/order" - zwraca informacje o wszystkich zleceniach
- ✅🧪☑️ - "http://localhost:5000/api/order/:id" - zwraca informacje o konkretnym zleceniu
- ✅🧪☑️ - "http://localhost:5000/api/order/client/:id" - zwraca informacje o wszystkich zleceniach klienta
- ✅🧪☑️ - "http://localhost:5000/api/order/:id/costs" - zwraca koszty dla danego zlecenia (pracownicy + materiały)
- ✅🧪☑️ - "http://localhost:5000/api/order/:id/resources" - zwraca zasoby dla danego zlecenia

### Dni pracy

#### Zapytania DB

- `select * from get_dzienpracy_by_month(year, month, pracownik_id);` - zwraca dzien pracy dla danego miesiaca
- `select * from get_dzienpracy_by_date(pracownik_id/null, year, month, day);` - zwraca dzien pracy dla danej daty dla wsyzstkich lub konkretnego pracownika

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/workday/:id/:year/:month" - zwraca informacje o wszystkich dniach pracy dla danego miesiąca i roku dla konkretnego pracownika
- ✅🧪☑️ - "http://localhost:5000/api/workday/:year/:month" - zwraca informacje o wszystkich dniach pracy dla danego miesiąca i roku dla wszystkich pracowników
- ✅🧪☑️ - "http://localhost:5000/api/workday/:id/:year/:month/:day" - zwraca informacje o konkretnym dniu pracy dla konkretnego pracownika

### Magazyn

#### Zapytania DB

- `select * from get_magazyny();` - zwraca informacje o wszystkich magazynach
- `select * from get_zasoby_magazynu(magazyn_id);` - zwraca informacje o zasobach magazynu z poziomu uprawnionego użytkownika (menedżer)
- `select * from get_zasoby_magazynu_pracownik(magazyn_id);` - zwraca informacje o zasobach magazynu z poziomu nieuprawnionego pracownika z widoku w bazie danych.

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/warehouse" - zwraca informacje o wszystkich magazynach
- ✅🧪☑️ - "http://localhost:5000/api/warehouse/:id/resources" - zwraca informacje o zasobach konkretnego magazynu

### Stanowiska

#### Zapytania DB

- `select * from get_stanowiska();` - zwraca informacje o wszystkich stanowiskach

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/position" - zwraca informacje o wszystkich stanowiskach

### Zasób (materiał/sprzęt)

#### Zapytania DB

- `select * from get_zasoby();` - zwraca informacje o wszystkich zasobach

#### Endpointy

(w razie potrzeby dostania informacji o jednym zasobie wystarczy filtrowanie na poziomie js'a)

- ✅🧪☑️ - "http://localhost:5000/api/resource" - zwraca informacje o wszystkich zasobach

## ZAPYTANIA POST

### Użytkownik

#### Zapytania DB

- `INSERT INTO pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) VALUES (...);`

#### Endpointy

- ✅🧪☑️ - "http://localhost:5000/api/user/create" - tworzy nowego pracownika

### Klient

#### Zapytania DB

- `INSERT INTO klient (imie, nazwisko, firma, telefon, email, adres) VALUES (...);`

#### Endpointy

- "http://localhost:5000/api/client/create" - tworzy nowego klienta

### Zlecenie

#### Zapytania DB

- `INSERT INTO zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, data_zakonczenia, lokalizacja) VALUES (...);`

#### Endpointy

- "http://localhost:5000/api/order/create" - tworzy nowe zlecenie

### Dni pracy

#### Zapytania DB

- `INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data, opis_pracownika, opis_managera) VALUES (...);`

#### Endpointy

- "http://localhost:5000/api/order/workday" - tworzy nowy dzień pracy

### Magazyn

#### Zapytania DB

- `INSERT INTO magazyn (nazwa, lokalizacja) VALUES (...);`
- `select dodaj_zasob_do_magazynu(ilosc, magazyn_id, zasob_id);` - dodanie zasobu do magazynu

#### Endpointy

- "http://localhost:5000/api/warehouse/" - tworzy nowy magazyn
- "http://localhost:5000/api/warehouse/resource" - dodaje zasób do magazynu

### Stanowiska

#### Zapytania DB

- `INSERT INTO stanowisko (nazwa, opis) VALUES (...);`

#### Endpointy

- "http://localhost:5000/api/position/create" - tworzy nową pozycję

### Zasób (materiał/sprzęt)

#### Zapytania DB

- `INSERT INTO zasob (nazwa, jednostka, typ, koszt_jednostkowy, opis) VALUES (...);`

#### Endpointy

- "http://localhost:5000/api/resource/create" - tworzy nowy zasób

## ZAPYTANIA PUT

## ZAPYTANIA DELETE
