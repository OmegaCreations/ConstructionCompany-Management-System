# Główne koncepty aplikacji

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

- controllers: Obsługa żądań HTTP. Odbiera dane oraz deleguje logikę do services
- middlewares: Przechwytywanie i modyfikowanie żądań (np. weryfikacja JWT)
- models: Definicje schematów danych dla bazy (w tym przypadku PostgreSQL)
- routes: Definicje tras API (np. /api/auth, /api/employees)
- services: Logika biznesowa (zapytania do bazy danych, obliczenia)
- utils: Pomocnicze funkcje (szyfrowanie haseł, generowanie JWT itp.)
- config: Konfiguracja bazy danych, zmiennych środowiskowych itp.
- app.ts: Konfiguracja serwera, główny plik
- server.ts: Start aplikacji.

# instalacja typów do TypeScript'a

npm i --save-dev @types/node - nodejs
npm i --save-dev @types/express - expressjs
npm i --save-dev @types/pg - postgres
npm i --save-dev @types/cors - cors
