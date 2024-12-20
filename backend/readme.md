# Opis endpointów backendu

Poniżej znajdą Państwo opis wszystkich endpoint'ów potrzebnych do zaimplementowania pełni funkcjonalności aplikacji.

✅ - zaimplementowane w całym backendzie
☑️ - zaimplementowane na froncie
🧪 - przetestowane w Postman'ie

## ZAPYTANIA GET

### Użytkownik

#### Zapytania DB

`select * from get_pracownicy(int/null);`
`select * from get_wyplata_status(pracownik_id);` - aktualny stan wyplaty na ten miesiac

#### Endpointy

✅🧪 - "http://localhost:5000/api/user" - zwraca informacje o wszystkich użytkownikach
✅🧪 - "http://localhost:5000/api/user/:id" - zwraca informacje o konkretnym użytkowniku
✅🧪 - "http://localhost:5000/api/user/:id/paycheck" - zwraca informacje o wypłacie konkretnego użytkownika

### Klient

#### Zapytania DB

`select * from get_klienci(int/null);`

#### Endpointy

✅🧪 - "http://localhost:5000/api/client" - zwraca informacje o wszystkich klientach
✅🧪 - "http://localhost:5000/api/client/:id" - zwraca informacje o konkretnym kliencie

### Zlecenie

#### Zapytania DB

`select * from get_klient_zlecenia(klient_id);` - zlecenia klienta
`select * from get_zlecenie_info(zlecenie_id);` - informacje o zleceniu
`select * from get_pracownicy_koszty(zlecenie_id);` - koszty utrzymania pracowników dla danego zlecenia
`select * from get_dodatkowe_koszty(zlecenie_id);` - dodatkowe koszty brakujących materiałów dla zlecenia

#### Endpointy

- "http://localhost:5000/api/order" - zwraca informacje o wszystkich zleceniach
- "http://localhost:5000/api/order/?id" - zwraca informacje o konkretnym zleceniu
- "http://localhost:5000/api/order/client/:id" - zwraca informacje o wszystkich zleceniach klienta
- "http://localhost:5000/api/order/:id/koszty" - zwraca koszty dla danego zlecenia (pracownicy + materiały)

### Dni pracy

- "http://localhost:5000/api/workday/?year&month" - zwraca informacje o wszystkich dniach pracy dla danego miesiąca i roku
- "http://localhost:5000/api/workday/?id" - zwraca informacje o konkretnym dniu pracy

### Magazyn

- "http://localhost:5000/api/magazine" - zwraca informacje o wszystkich magazynach
- "http://localhost:5000/api/magazine/?id" - zwraca informacje o konkretnym magazynie

### Stanowiska

- "http://localhost:5000/api/position" - zwraca informacje o wszystkich stanowiskach
- "http://localhost:5000/api/position/?id" - zwraca informacje o konkretnym stanowisku

### Zasób (materiał/sprzęt)

- "http://localhost:5000/api/resource" - zwraca informacje o wszystkich zasobach
- "http://localhost:5000/api/resource/?id" - zwraca informacje o konkretnym zasobie

## ZAPYTANIA POST

- "http://localhost:5000/api/auth/login"

## ZAPYTANIA PUT

## ZAPYTANIA DELETE
