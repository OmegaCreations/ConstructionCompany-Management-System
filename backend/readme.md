# Opis endpointów backendu

Poniżej znajdą Państwo opis wszystkich endpoint'ów potrzebnych do zaimplementowania pełni funkcjonalności aplikacji.

## ZAPYTANIA GET

### Użytkownik

- "http://localhost:5000/api/user" - zwraca informacje o wszystkich użytkownikach
- "http://localhost:5000/api/user/:id" - zwraca informacje o konkretnym użytkowniku

### Klient

- "http://localhost:5000/api/client" - zwraca informacje o wszystkich klientach
- "http://localhost:5000/api/client/?id" - zwraca informacje o konkretnym kliencie

### Zlecenie

- "http://localhost:5000/api/order" - zwraca informacje o wszystkich zleceniach
- "http://localhost:5000/api/order/?id" - zwraca informacje o konkretnym zleceniu

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
