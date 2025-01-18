# API Documentation

This document describes the API endpoints required to implement the full functionality of the application. Each endpoint includes details about its implementation status:

- ✅: Fully implemented in the backend.
- 🧪: Tested using Postman/Client.

---

## GET Requests

### User

#### Database Queries
- `SELECT * FROM get_pracownicy(pracownik_id/null);` - Returns specific worker or all workers (if **null** passed as parameter)
- `SELECT * FROM get_wyplata_status(pracownik_id);` - Current monthly salary status.

#### Endpoints
- ✅🧪 **GET** `/api/user`  
  Returns information about all users.
- ✅🧪 **GET** `/api/user/:id`  
  Returns details of a specific user.
- ✅🧪 **GET** `/api/user/:id/paycheck`  
  Returns paycheck information for a specific user.

---

### Client

#### Database Queries
- `SELECT * FROM get_klienci(klient_id/null);` - Returns specific client or all clients (if **null** passed as parameter)
- `select * from get_klient_zlecenia_as_client(klient_id)`-  Returns details of a specific client and their orders using client only view. 
- `SELECT k.klient_id, k.imie, k.nazwisko, k.firma, k.telefon, k.email, k.adres FROM klient k WHERE email = $1` - Finds client with given email adress. Used for checking client's existence. 

#### Endpoints
- ✅🧪 **GET** `/api/client`  
  Returns information about all clients.
- ✅🧪 **GET** `/api/client/:id`  
  Returns details of a specific client.
 - ✅🧪 **GET** `/api/client/public`  
  Returns details of a specific client using client only view. 

---

### Order

#### Database Queries
- `SELECT * FROM get_klient_zlecenia(klient_id);`  
  Returns orders for a client.
- `SELECT * FROM get_zlecenie_info(zlecenie_id/null);`  
  Returns details of an order or all orders.
- `SELECT * FROM get_zlecenie_zasoby(zlecenie_id);`  
  Returns resources assigned to an order.
- `SELECT * FROM get_pracownicy_koszty(zlecenie_id);`  
  Returns employee costs for an order.
- `SELECT * FROM get_dodatkowe_koszty(zlecenie_id);`  
  Returns additional costs for an order.

#### Endpoints
- ✅🧪 **GET** `/api/order`  
  Returns information about all orders.
 - ✅🧪 **GET** `/api/order/profits`   
  Returns information about all orders' profits.
- ✅🧪 **GET** `/api/order/:id`  
  Returns details of a specific order.
- ✅🧪 **GET** `/api/order/client/:id`  
  Returns all orders for a specific client.
- ✅🧪 **GET** `/api/order/:id/costs`  
  Returns costs for an order (employees + materials).
- ✅🧪 **GET** `/api/order/:id/resources`  
  Returns resources for an order.

---

### Workday

#### Database Queries
- `SELECT * FROM get_dzienpracy_by_month(year, month, pracownik_id);`  
  Returns workdays for a given month and year.
- `SELECT * FROM get_dzienpracy_by_date(pracownik_id/null, year, month, day);`  
  Returns workdays for a specific date.
- `SELECT * FROM get_summed_work_hours(pracownik_id);` - Returns summed working hours for the current month and year for the specific user.

#### Endpoints
- ✅🧪 **GET** `/api/workday/:id/:year/:month`  
  Returns workdays for a specific employee and month.
- ✅🧪 **GET** `/api/workday/:year/:month`  
  Returns workdays for all employees in a specific month.
- ✅🧪 **GET** `/api/workday/:id/:year/:month/:day`  
  Returns a specific workday for an employee.
- ✅🧪 **GET** `/api/workday/workedhours`  
  Returns total worked hours for a given month.

---

### Warehouse

#### Database Queries
- `SELECT * FROM get_magazyny();`  
  Returns information about all warehouses.
- `SELECT * FROM get_zasoby_magazynu(magazyn_id);`  
  Returns warehouse resources for authorized users.
- `SELECT * FROM get_zasoby_magazynu_pracownik(magazyn_id);`  
  Returns warehouse resources for regular employees.

#### Endpoints
- ✅🧪 **GET** `/api/warehouse`  
  Returns information about all warehouses.
- ✅🧪 **GET** `/api/warehouse/:id/resources`  
  Returns resources for a specific warehouse.

---

### Position

#### Database Queries
- `SELECT * FROM get_stanowiska();`  
  Returns information about all positions.

#### Endpoints
- ✅🧪 **GET** `/api/position`  
  Returns information about all positions.

---

### Resource

#### Database Queries
- `SELECT * FROM get_zasoby();`  
  Returns information about all resources.

#### Endpoints
- ✅🧪 **GET** `/api/resource`  
  Returns information about all resources.

---

### Shopping List

#### Endpoint
- ✅🧪 **GET** `/api/shoppinglist/:year/:month/:day`  
  Returns missing resources for a given date. (implemented only in a month range)

---

## POST Requests

### Auth

#### Database Queries
- `SELECT p.pracownik_id, p.imie, p.nazwisko, p.telefon, p.email, p.haslo, p.stawka_godzinowa, s.stanowisko_id, s.nazwa as stanowisko_nazwa FROM pracownik p JOIN stanowisko s using(stanowisko_id) WHERE email = $1` - Returns user's data based on provided email address. Used for checking user's existance.

#### Endpoint
- ✅🧪 **POST** `/api/auth/login` - Logs in user.
- ✅🧪 **POST** `/api/auth/refresh`  - Refreshes access token with given refresh token.

---

### User

#### Database Queries
- `INSERT INTO pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;` - Creates new user record in database. (returns created user)

#### Endpoint
- ✅🧪 **POST** `/api/user/`  
  Creates a new user.

---

### Client

#### Database Queries
- `INSERT INTO klient (imie, nazwisko, firma, telefon, email, adres) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;` - Creates new client record in database. (returns created client)

#### Endpoint
- ✅🧪 **POST** `/api/client/`  
  Creates a new client.

---

### Order

#### Database Queries
- `SELECT dodaj_zlecenie($1, $2, $3, $4, $5, $6, $7);` - Creates new order. (and returns created order)
- `select dodaj_zasob_do_zlecenia($1, $2, $3);` - Adds needed resource to the existing order.

#### Endpoints
- ✅🧪 **POST** `/api/order/`  
  Creates a new order.
- ✅🧪 **POST** `/api/order/resource/`  
  Adds resources to an order.

---

### Workday

#### Database Queries
- `SELECT dodaj_dzien_pracy($1, $2, $3, $4);` - Creates new workday and returns it's object.

#### Endpoint
- ✅🧪 **POST** `/api/order/workday/`  
  Creates a new workday.

---

### Warehouse

#### Database Queries
- `INSERT INTO magazyn (nazwa, lokalizacja) VALUES ($1, $2) RETURNING *;` - Creates new warehouse record.
- `SELECT dodaj_zasob_do_magazynu($1, $2, $3);` - Adds resources to a warehouse.

#### Endpoints
- ✅🧪 **POST** `/api/warehouse/`  
  Creates a new warehouse.
- ✅🧪 **POST** `/api/warehouse/resource/`  
  Adds resources to a warehouse.

---

### Position

#### Database Queries
- `INSERT INTO stanowisko (nazwa, opis) VALUES ($1, $2) RETURNING *;` - Creates new position record in database.

#### Endpoint
- ✅🧪 **POST** `/api/position/`  
  Creates a new position.

---

### Resource

#### Database Queries
- `INSERT INTO zasob (nazwa, jednostka, typ, opis, koszt_jednostkowy) VALUES ($1, $2, $3, $4, $5) RETURNING *;` - Creates new resource type in database.

#### Endpoint
- ✅🧪 **POST** `/api/resource/`  
  Creates a new resource.

---

## PUT Requests

### Auth

#### Database Queries
- `UPDATE pracownik SET haslo = $1 WHERE pracownik_id = $2;` - Updates user's password.

#### Endpoint
- ✅🧪 **PUT** `/api/auth/change-password` 
Changes user's current password.

---

### User

#### Database Queries
- `SELECT update_pracownik($1, $2, $3, $4, $5, $6, $7);` - If null passed in non needed argument, then old column data won't be changed.

#### Endpoint
- ✅🧪 **PUT** `/api/user/`  
 Updates an existing user.

---

### Client

#### Database Queries
- `SELECT update_klient($1, $2, $3, $4, $5, $6, $7);`

#### Endpoint
- ✅🧪 **PUT** `/api/client/`  
  Updates an existing client.

---

### Order

#### Database Queries

- `SELECT update_zlecenie($1, $2, $3, $4, $5, $6, $7, $8);` - Updates specific order.
- `SELECT update_zasob_zlecenie($1, $2, $3);` - Updates order's needed resource.

#### Endpoints
- ✅🧪 **PUT** `/api/order/`  
  Creates a new order.
- ✅🧪 **PUT** `/api/order/resource/`  
  Adds resources to an order.

---

### Workday

#### Database Queries
- `SELECT update_dzien_pracy($1, $2, $3, $4, $5, $6, $7);` - Updates existing workday.

#### Endpoint
- ✅🧪 **PUT** `/api/order/workday/`  
  Updates a workday.

---

### Warehouse

#### Database Queries
- `SELECT update_magazyn($1, $2, $3);`
- `SELECT update_magazyn_zasob($1, $2, $3, $4);`

#### Endpoints
- ✅🧪 **PUT** `/api/warehouse/`  
  Updates existing warehouse.
- ✅🧪 **PUT** `/api/warehouse/resource/`  
  Updates resource in a warehouse.

---
### Position

#### Database Queries
- `SELECT update_stanowisko($1, $2, $3);` 

#### Endpoint
- ✅🧪 **PUT** `/api/position/`  
  Updates an existing position.

---

### Resource

#### Database Queries
- `SELECT update_zasob($1, $2, $3, $4, $5, $6);` 

#### Endpoint
- ✅🧪 **POST** `/api/resource/`  
 Updates an existing resource type.



## DELETE Requests

### User

#### Database Queries
- `DELETE FROM pracownik WHERE pracownik_id = $1 RETURNING *;`

#### Endpoint
- ✅🧪 **DELETE** `/api/user/`  
 Deletes an existing user with given id.

---

### Client

#### Database Queries
- `DELETE FROM klient WHERE klient_id = $1 RETURNING *;`

#### Endpoint
- ✅🧪 **DELETE** `/api/client/`  
  Deletes an existing client.

---

### Order

#### Database Queries

- `DELETE FROM zlecenie WHERE zlecenie_id = $1 RETURNING *;`
- `DELETE FROM zasob_zlecenie WHERE zasob_id = $1 AND zlecenie_id = $2 RETURNING *;`

#### Endpoints

- ✅🧪 **DELETE** `/api/order/`  
  Deletes an existing order.
- ✅🧪 **DELETE** `/api/order/resource/`  
  Deletes needed resource from order.

---

### Workday

#### Database Queries

- `DELETE FROM dzien_pracy WHERE pracownik_id = $1 AND zlecenie_id = $2 AND data = $3 RETURNING *;`

#### Endpoint

- ✅🧪 **DELETE** `/api/order/workday/`  
  Deletes a workday.

---

### Warehouse

#### Database Queries
- `DELETE FROM magazyn WHERE magazyn_id = $1 RETURNING *;`
- `DELETE FROM magazyn_zasob WHERE magazyn_zasob_id = $1 RETURNING *;`

#### Endpoints
- ✅🧪 **DELETE** `/api/warehouse/`  
  Deletes an existing warehouse.
- ✅🧪 **DELETE** `/api/warehouse/resource/`  
  Deletes resource from a specific warehouse.

---
### Position

#### Database Queries
- `DELETE FROM stanowisko WHERE stanowisko_id = $1 RETURNING *;` 

#### Endpoint
- ✅🧪 **DELETE** `/api/position/`  
  Deletes an existing position.

---

### Resource

#### Database Queries
- `DELETE FROM zasob WHERE zasob_id = $1 RETURNING *;` 

#### Endpoint
- ✅🧪 **DETELE** `/api/resource/`  
 Deletes an existing resource type.

--- 

For further details, please refer to the database files.

