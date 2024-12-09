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



-- =========================================
-- tabela: stanowisko
-- =========================================
create table stanowisko (
    stanowisko_id serial primary key,
    nazwa varchar(50) not null unique,
    opis text
);

-- =========================================
-- tabela: pracownik
-- =========================================
create table pracownik (
    pracownik_id serial primary key,
    imie varchar(50) not null,
    nazwisko varchar(50) not null,
    telefon varchar(15),
    email varchar(50) unique,
    haslo varchar(255) not null,
    stawka_godzinowa decimal(10, 2) not null check (stawka_godzinowa > 0),
    stanowisko_id int not null references stanowisko(stanowisko_id) on delete set null
);

-- =========================================
-- tabela: klient
-- =========================================
create table klient (
    klient_id serial primary key,
    imie varchar(50),
    nazwisko varchar(50),
    firma varchar(50),
    telefon varchar(15),
    email varchar(50) unique,
    adres text
);


-- =========================================
-- tabela: zlecenie
-- =========================================
create table zlecenie (
    zlecenie_id serial primary key,
    klient_id int not null references klient(klient_id) on delete cascade,
    opis text not null,
    data_zlozenia date not null,
    data_rozpoczecia date,
    data_zakonczenia date,
    lokalizacja varchar(150) not null,
    constraint check_data check (data_zakonczenia is null or data_rozpoczecia <= data_zakonczenia)
);


-- =========================================
-- tabela: sprzet
-- =========================================
create table sprzet (
    sprzet_id serial primary key,
    nazwa varchar(50) not null,
    opis text,
    koszt_jednostkowy decimal(10, 2) not null check (koszt_jednostkowy >= 0)
);


-- =========================================
-- tabela: magazyn
-- =========================================
create table magazyn (
    magazyn_id serial primary key,
    nazwa varchar(50) not null,
    lokalizacja varchar(150) not null
);


-- TABELE ASOCJACYJNE

-- =========================================
-- tabela: dzien_pracy
-- =========================================
create table dzien_pracy (
    pracownik_id int not null references pracownik(pracownik_id) on delete cascade,
    zlecenie_id int not null references zlecenie(zlecenie_id) on delete cascade,
    data date not null,
    godzina_rozpoczecia time,
    godzina_zakonczenia time,
    primary key (pracownik_id, zlecenie_id, data)
);

-- =========================================
-- tabela: magazyn_sprzet
-- =========================================
create table magazyn_sprzet (
    magazyn_id int not null references magazyn(magazyn_id) on delete cascade,
    sprzet_id int not null references sprzet(sprzet_id) on delete cascade,
    ilosc int not null check (ilosc >= 0),
    primary key (magazyn_id, sprzet_id)
);

-- =========================================
-- tabela: sprzet_zlecenie
-- =========================================
create table sprzet_zlecenie (
    sprzet_id int not null references sprzet(sprzet_id) on delete cascade,
    zlecenie_id int not null references zlecenie(zlecenie_id) on delete cascade,
    ilosc_potrzebna int not null check (ilosc_potrzebna >= 0),
    ilosc_zapewniona int not null check (ilosc_zapewniona >= 0 and ilosc_zapewniona <= ilosc_potrzebna),
    primary key (sprzet_id, zlecenie_id)
);
