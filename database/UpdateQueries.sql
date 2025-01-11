-- STANOWISKO
CREATE OR REPLACE FUNCTION update_stanowisko(
    p_stanowisko_id INT,
    p_nazwa VARCHAR,
    p_opis TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE stanowisko
    SET
        nazwa = COALESCE(p_nazwa, nazwa),
        opis = COALESCE(p_opis, opis)
    WHERE stanowisko_id = p_stanowisko_id;
END;
$$ LANGUAGE plpgsql;


-- PRACOWNIK
CREATE OR REPLACE FUNCTION update_pracownik(
    p_pracownik_id INT,
    p_imie VARCHAR,
    p_nazwisko VARCHAR,
    p_telefon VARCHAR,
    p_email VARCHAR,
    p_haslo VARCHAR,
    p_stawka_godzinowa DECIMAL,
    p_stanowisko_id INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE pracownik
    SET
        imie = COALESCE(p_imie, imie),
        nazwisko = COALESCE(p_nazwisko, nazwisko),
        telefon = COALESCE(p_telefon, telefon),
        email = COALESCE(p_email, email),
        haslo = COALESCE(p_haslo, haslo),
        stawka_godzinowa = COALESCE(p_stawka_godzinowa, stawka_godzinowa),
        stanowisko_id = COALESCE(p_stanowisko_id, stanowisko_id)
    WHERE pracownik_id = p_pracownik_id;
END;
$$ LANGUAGE plpgsql;


-- KLIENT
CREATE OR REPLACE FUNCTION update_klient(
    p_klient_id INT,
    p_imie VARCHAR,
    p_nazwisko VARCHAR,
    p_firma VARCHAR,
    p_telefon VARCHAR,
    p_email VARCHAR,
    p_adres TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE klient
    SET
        imie = COALESCE(p_imie, imie),
        nazwisko = COALESCE(p_nazwisko, nazwisko),
        firma = COALESCE(p_firma, firma),
        telefon = COALESCE(p_telefon, telefon),
        email = COALESCE(p_email, email),
        adres = COALESCE(p_adres, adres)
    WHERE klient_id = p_klient_id;
END;
$$ LANGUAGE plpgsql;


-- ZLECENIE
CREATE OR REPLACE FUNCTION update_zlecenie(
    p_zlecenie_id INT,
    p_klient_id INT,
    p_wycena DECIMAL,
    p_opis TEXT,
    p_data_zlozenia DATE,
    p_data_rozpoczecia DATE,
    p_data_zakonczenia DATE,
    p_lokalizacja VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE zlecenie
    SET
        klient_id = COALESCE(p_klient_id, klient_id),
        wycena = COALESCE(p_wycena, wycena),
        opis = COALESCE(p_opis, opis),
        data_zlozenia = COALESCE(p_data_zlozenia, data_zlozenia),
        data_rozpoczecia = COALESCE(p_data_rozpoczecia, data_rozpoczecia),
        data_zakonczenia = COALESCE(p_data_zakonczenia, data_zakonczenia),
        lokalizacja = COALESCE(p_lokalizacja, lokalizacja)
    WHERE zlecenie_id = p_zlecenie_id;
END;
$$ LANGUAGE plpgsql;


-- DZIEŃ PRACY
CREATE OR REPLACE FUNCTION update_dzien_pracy(
    p_pracownik_id INT,
    p_zlecenie_id INT,
    p_data DATE,
    p_opis_pracownika TEXT,
    p_opis_managera TEXT,
    p_godzina_rozpoczecia TIME,
    p_godzina_zakonczenia TIME
)
RETURNS VOID AS $$
BEGIN
    UPDATE dzien_pracy
    SET
        opis_pracownika = COALESCE(p_opis_pracownika, opis_pracownika),
        opis_managera = COALESCE(p_opis_managera, opis_managera),
        godzina_rozpoczecia = COALESCE(p_godzina_rozpoczecia, godzina_rozpoczecia),
        godzina_zakonczenia = COALESCE(p_godzina_zakonczenia, godzina_zakonczenia)
    WHERE pracownik_id = p_pracownik_id
      AND zlecenie_id = p_zlecenie_id
      AND data = p_data;
END;
$$ LANGUAGE plpgsql;


-- ZASÓB
CREATE OR REPLACE FUNCTION update_zasob(
    p_zasob_id INT,
    p_nazwa VARCHAR,
    p_jednostka VARCHAR,
    p_typ TEXT,
    p_koszt_jednostkowy DECIMAL,
    p_opis TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE zasob
    SET
        nazwa = COALESCE(p_nazwa, nazwa),
        jednostka = COALESCE(p_jednostka, jednostka),
        typ = COALESCE(p_typ, typ),
        koszt_jednostkowy = COALESCE(p_koszt_jednostkowy, koszt_jednostkowy),
        opis = COALESCE(p_opis, opis)
    WHERE zasob_id = p_zasob_id;
END;
$$ LANGUAGE plpgsql;


-- MAGAZYN
CREATE OR REPLACE FUNCTION update_magazyn(
    p_magazyn_id INT,
    p_nazwa VARCHAR,
    p_lokalizacja VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE magazyn
    SET
        nazwa = COALESCE(p_nazwa, nazwa),
        lokalizacja = COALESCE(p_lokalizacja, lokalizacja)
    WHERE magazyn_id = p_magazyn_id;
END;
$$ LANGUAGE plpgsql;


-- ZASÓB MAGAZYNU
CREATE OR REPLACE FUNCTION update_magazyn_zasob(
    p_magazyn_zasob_id INT,
    p_ilosc INT,
    p_magazyn_id INT,
    p_zasob_id INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE magazyn_zasob
    SET
        ilosc = COALESCE(p_ilosc, ilosc),
        magazyn_id = COALESCE(p_magazyn_id, magazyn_id),
        zasob_id = COALESCE(p_zasob_id, zasob_id)
    WHERE magazyn_zasob_id = p_magazyn_zasob_id;
END;
$$ LANGUAGE plpgsql;


-- ZASÓB WYMAGANY DO ZLECENIA
CREATE OR REPLACE FUNCTION update_zasob_zlecenie(
    p_zasob_id INT,
    p_zlecenie_id INT,
    p_ilosc_potrzebna INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE zasob_zlecenie
    SET
        ilosc_potrzebna = COALESCE(p_ilosc_potrzebna, ilosc_potrzebna)
    WHERE zasob_id = p_zasob_id AND zlecenie_id = p_zlecenie_id;
END;
$$ LANGUAGE plpgsql;
