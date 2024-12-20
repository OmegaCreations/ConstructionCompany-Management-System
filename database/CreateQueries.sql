-- =========================================
-- globalne ustawianie
set client_encoding to 'UTF8';

create schema construction_company;
set search_path to construction_company;


-- new user
CREATE USER construction_company_admin WITH PASSWORD '<secret-password>';

-- create new role for this schema
CREATE ROLE construction_company_admin_role;
ALTER ROLE construction_company_admin SET search_path TO construction_company -- construction company as a base schema

-- permissions
GRANT USAGE, CREATE ON SCHEMA construction_company TO construction_company_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA construction_company TO construction_company_admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA construction_company TO construction_company_admin_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA construction_company TO construction_company_admin_role;

-- add role to user
GRANT construction_company_admin_role TO construction_company_admin;


-- ==========================================
--          Tworzenie bazy danych
-- ==========================================
CREATE TABLE stanowisko (
    stanowisko_id SERIAL PRIMARY KEY,
    nazwa VARCHAR(50) NOT NULL UNIQUE,
    opis TEXT
);

CREATE TABLE pracownik (
    pracownik_id SERIAL PRIMARY KEY,
    imie VARCHAR(50) NOT NULL,
    nazwisko VARCHAR(50) NOT NULL,
    telefon VARCHAR(15),
    email VARCHAR(50) UNIQUE,
    haslo VARCHAR(255) NOT NULL,
    stawka_godzinowa DECIMAL NOT NULL,
    stanowisko_id INT NOT NULL REFERENCES stanowisko(stanowisko_id)
);

CREATE TABLE klient (
    klient_id SERIAL PRIMARY KEY,
    imie VARCHAR(50),
    nazwisko VARCHAR(50),
    firma VARCHAR(50),
    telefon VARCHAR(15),
    email VARCHAR(50) UNIQUE,
    adres TEXT
);

CREATE TABLE zlecenie (
    zlecenie_id SERIAL PRIMARY KEY,
    klient_id INT NOT NULL REFERENCES klient(klient_id),
    opis TEXT NOT NULL,
    data_zlozenia DATE NOT NULL,
    data_rozpoczecia DATE,
    data_zakonczenia DATE,
    lokalizacja VARCHAR(150) NOT NULL
);

CREATE TABLE dzien_pracy (
    pracownik_id INT NOT NULL REFERENCES pracownik(pracownik_id),
    zlecenie_id INT NOT NULL REFERENCES zlecenie(zlecenie_id),
    data DATE NOT NULL,
    godzina_rozpoczecia TIME,
    godzina_zakonczenia TIME,
    PRIMARY KEY (pracownik_id, zlecenie_id, data)
);

CREATE TABLE zasob (
    zasob_id SERIAL PRIMARY KEY,
    nazwa VARCHAR(50) NOT NULL,
    jednostka VARCHAR(20) NOT NULL,
    typ TEXT CHECK (typ IN ('material', 'sprzet')) NOT NULL, -- enum? :)
    koszt_jednostkowy DECIMAL NOT NULL,
    opis TEXT
);

CREATE TABLE magazyn (
    magazyn_id SERIAL PRIMARY KEY,
    nazwa VARCHAR(50) NOT NULL,
    lokalizacja VARCHAR(150) NOT NULL
);

CREATE TABLE magazyn_zasob (
	magazyn_zasob_id SERIAL primary key,
    ilosc INT NOT NULL,
    magazyn_id INT NOT NULL REFERENCES magazyn(magazyn_id),
    zasob_id INT NOT NULL REFERENCES zasob(zasob_id)
);

CREATE TABLE zasob_zlecenie (
    magazyn_zasob_id INT NOT NULL REFERENCES magazyn_zasob(magazyn_zasob_id),
    zlecenie_id INT NOT NULL REFERENCES zlecenie(zlecenie_id),
    ilosc_potrzebna INT NOT NULL,
    PRIMARY KEY (magazyn_zasob_id, zlecenie_id)
);
