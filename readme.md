# Główne koncepty aplikacji (English at the bottom)

## Frontend

Dlaczego vite?

- Dobry bundler, szybkie buildy aplikacji

Opis modułów

- Korzystam z czystego reacta (zamiast np. remixa) na potrzeby prezentacji umiejętności w projekcie - stąd też czysty CSS
- React-router - dla routingu wewnątrz aplikacji
- Redux - dla zapamiętania stanu użytkownika (zalogowany/niezalogowany + pracownik/szef)

## Backend

Opis działania aplikacji

- architektura MVC (Model, View, Controller)
- autentykacja użytkownika za pomocą tokenizacji JWT

Opis modułów

- typescript - przyda się do weryfikowania logiki typów zwłaszcza w większej aplikacji
- nodejs + express
- pg - moduł łączenia się z bazą danych typu PostgreSQL
- helmet - podstawowe zabezpieczenia aplikacji express'a (np. przed cross-site scripting)
- dotenv - nie chcemy pokazywać kluczy, adresów i haseł np do bazy danych :)
- nodemon - reloading serwera przy każdych zapisanych zmianach żeby nie robić tego ręcznie

### Opis struktury plików

Aby zrozumieć poniższą strukturę plików, stworzyłem prosty endpoint /api/hello w app.ts - wystarczy prześledzić importy które obsługują ten endpoint, aby zrozumieć cały flow architektury.

- middlewares: Przechwytywanie i modyfikowanie żądań (np. weryfikacja JWT)
- routes: Definicje tras API (np. /api/auth, /api/employees) - ustala które endpointy mają odpowiadać za dane rządania HTTP i deleguje zapytania do kontrolerów.
- controllers: Obsługa żądań HTTP. Odbiera dane oraz deleguje logikę biznesową do services. Generalnie nie przechowuje dużej i skomplikowanej logiki tylko obsługuje przepływ danych od klienta do bazy danych i spowrotem.
- services: Logika biznesowa (zapytania do bazy danych, obliczenia, walidacje danych, transformacje danych, rozmowa z zewnętrznymi API). Generalnie tutaj jest ta bardziej złożona logika. Nie przechowuje tutaj danych ponieważ są one przekazywane z kontrolera bądź modelu.

Service Validation: Employees for the bartender position must be 21 or over, and approved by a manager.

- models: Definicje schematów danych dla bazy (w tym przypadku PostgreSQL). Zazwyczaj zawiera logikę z zapytaniami do bazy danych oraz deinicje struktur, które są później mapowane na tabele w bazie danych.

Model Validation: Employee must have a id, first and last name, and birthday.

- utils: Pomocnicze funkcje (szyfrowanie haseł, generowanie JWT, walidatory danych itp.)
- config: Konfiguracja bazy danych, zmiennych środowiskowych itp.
- app.ts: Konfiguracja serwera, główny plik
- server.ts: Start aplikacji.

# instalacja typów do TypeScript'a

npm i --save-dev @types/node - nodejs
npm i --save-dev @types/express - expressjs
npm i --save-dev @types/pg - postgres
npm i --save-dev @types/cors - cors
