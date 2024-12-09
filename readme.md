
# Main Concepts of the Application (Polish at the bottom)

## Frontend

### Why Vite?

-   A great bundler with fast application builds.

### Module Descriptions:

-   I am using plain React (instead of something like Remix) to demonstrate skills in this project—hence the use of plain CSS.
-   **React-router:** for routing within the application.
-   **Redux:** to manage user state (logged in/logged out + worker/manager roles).

## Backend

### Application Functionality:

-   **MVC architecture** (Model, View, Controller).
-   **User authentication** using JWT tokenization.

### Module Descriptions:

-   **TypeScript:** Useful for type-checking logic, especially in larger applications.
-   **Node.js + Express:** Backend framework.
-   **pg:** A module for connecting to a PostgreSQL database.
-   **Helmet:** Provides basic security measures for Express apps (e.g., against cross-site scripting).
-   **dotenv:** Ensures sensitive information like keys, addresses, and passwords (e.g., for databases) are not exposed.
-   **Nodemon:** Automatically reloads the server after changes, eliminating the need to restart it manually.

### File Structure Description:

To understand the file structure below, I created a simple `/api/hello` endpoint in `app.ts`. Following the imports used to handle this endpoint will provide insight into the flow of the architecture.

-   **middlewares:** Intercepts and modifies requests (e.g., JWT verification).
-   **routes:** Defines API routes (e.g., `/api/auth`, `/api/employees`). Determines which endpoints handle specific HTTP requests and delegates these to controllers.
-   **controllers:** Handles HTTP requests. Receives data and delegates business logic to services. Typically does not store complex logic but manages data flow between the client and database.
-   **services:** Contains business logic (e.g., database queries, computations, data validation, data transformations, and interactions with external APIs). This is where more complex logic resides, but it does not store data; instead, it operates on data passed from controllers or models.
-   **models:** Defines database schemas (in this case, for PostgreSQL). Usually contains logic for database queries and defines structures that map to database tables.
-   **utils:** Helper functions (e.g., password hashing, JWT generation, data validators, etc.).
-   **config:** Configuration for the database, environment variables, etc.
-   **app.ts:** Server configuration and main entry file.
-   **server.ts:** Application startup.

# Główne koncepty aplikacji (English at the top)

## Frontend

### Dlaczego vite?

- Dobry bundler, szybkie buildy aplikacji

### Opis modułów:

- Korzystam z czystego reacta (zamiast np. remixa) na potrzeby prezentacji umiejętności w projekcie - stąd też czysty CSS
- **React-router** - dla routingu wewnątrz aplikacji
- **Redux** - dla zapamiętania stanu użytkownika (zalogowany/niezalogowany + pracownik/szef)

## Backend

### Opis działania aplikacji:

- architektura **MVC** (Model, View, Controller)
- autentykacja użytkownika za pomocą tokenizacji **JWT**

### Opis modułów:

- **typescript** - przyda się do weryfikowania logiki typów zwłaszcza w większej aplikacji

- **nodejs + express**

- **pg** - moduł łączenia się z bazą danych typu PostgreSQL

- **helmet** - podstawowe zabezpieczenia aplikacji express'a (np. przed cross-site scripting)

- **dotenv** - nie chcemy pokazywać kluczy, adresów i haseł np do bazy danych :)

- **nodemon** - reloading serwera przy każdych zapisanych zmianach żeby nie robić tego ręcznie

### Opis struktury plików

Aby zrozumieć poniższą strukturę plików, stworzyłem prosty endpoint /api/hello w app.ts - wystarczy prześledzić importy które obsługują ten endpoint, aby zrozumieć cały flow architektury.

- **middlewares**: Przechwytywanie i modyfikowanie żądań (np. weryfikacja JWT)

- **routes**: Definicje tras API (np. `/api/auth, /api/employees`) - ustala które endpointy mają odpowiadać za dane rządania HTTP i deleguje zapytania do kontrolerów.

- **controllers**: Obsługa żądań HTTP. Odbiera dane oraz deleguje logikę biznesową do services. Generalnie nie przechowuje dużej i skomplikowanej logiki tylko obsługuje przepływ danych od klienta do bazy danych i spowrotem.

- **services**: Logika biznesowa (zapytania do bazy danych, obliczenia, walidacje danych, transformacje danych, rozmowa z zewnętrznymi API). Generalnie tutaj jest ta bardziej złożona logika. Nie przechowuje tutaj danych ponieważ są one przekazywane z kontrolera bądź modelu.

- **models**: Definicje schematów danych dla bazy (w tym przypadku PostgreSQL). Zazwyczaj zawiera logikę z zapytaniami do bazy danych oraz deinicje struktur, które są później mapowane na tabele w bazie danych.

- **utils**: Pomocnicze funkcje (szyfrowanie haseł, generowanie JWT, walidatory danych itp.)
- **config**: Konfiguracja bazy danych, zmiennych środowiskowych itp.
- **app.ts**: Konfiguracja serwera, główny plik
- **server.ts**: Start aplikacji.
