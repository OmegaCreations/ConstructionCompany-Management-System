-- ========================================= 
-- Funkcja: Pobiera informacje o wszystkich pracownikach lub konkretnym pracowniku
-- =========================================
CREATE OR REPLACE FUNCTION get_pracownicy(pracownik_id_param INT DEFAULT NULL)
RETURNS TABLE (
    pracownik_id INT,
    imie VARCHAR,
    nazwisko VARCHAR,
    telefon VARCHAR,
    email VARCHAR,
    stawka_godzinowa DECIMAL,
    stanowisko_id INT,
    stanowisko_nazwa VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.pracownik_id, 
        p.imie, 
        p.nazwisko, 
        p.telefon, 
        p.email, 
        p.stawka_godzinowa, 
        s.stanowisko_id,
        s.nazwa AS stanowisko_nazwa
    FROM pracownik p
    JOIN stanowisko s ON p.stanowisko_id = s.stanowisko_id
    WHERE pracownik_id_param IS NULL OR p.pracownik_id = pracownik_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Oblicza przepracowane godziny i status wypłaty dla pracownika dla aktualnego miesiąca
-- =========================================
CREATE OR REPLACE FUNCTION get_wyplata_status(pracownik_id_param INT)
RETURNS TABLE (
    przepracowane_godziny DECIMAL,
    wyplata_status DECIMAL
) AS $$ 
DECLARE
    godziny DECIMAL := 0;
    stawka DECIMAL := 0;
BEGIN
    
    SELECT 
        SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600)  
    INTO godziny
    FROM dzien_pracy dp
    WHERE dp.pracownik_id = pracownik_id_param 
      AND dp.godzina_zakonczenia IS NOT NULL
      AND dp.data >= date_trunc('month', CURRENT_DATE)  -- tylko dni z tego miesiąca
      AND dp.data < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month');

    -- stawka godzinowa
    SELECT 
        p.stawka_godzinowa
    INTO stawka
    FROM pracownik p
    WHERE p.pracownik_id = pracownik_id_param;

    -- jeśli nie ma przepracowanych to zwraca NULL'a, a chcemy 0.
    IF godziny IS NULL THEN
        wyplata_status := 0;
        przepracowane_godziny := 0;
    ELSE
        przepracowane_godziny := godziny;
        wyplata_status := godziny * stawka;
    END IF;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Pobiera dane o klientach
-- =========================================
CREATE OR REPLACE FUNCTION get_klienci(klient_id_param INT DEFAULT NULL)
RETURNS TABLE (
    klient_id INT,
    imie VARCHAR,
    nazwisko VARCHAR,
    firma VARCHAR,
    telefon VARCHAR,
    email VARCHAR,
    adres TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT k.klient_id, k.imie, k.nazwisko, k.firma, k.telefon, k.email, k.adres
    FROM klient k
    WHERE klient_id_param IS NULL OR k.klient_id = klient_id_param;
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Funkcja: Pobiera dane klienta oraz jego zleceń
-- =========================================
CREATE OR REPLACE FUNCTION get_klient_zlecenia(klient_id_param INT)
RETURNS TABLE (
    klient_id INT,
    imie VARCHAR,
    nazwisko VARCHAR,
    firma VARCHAR,
    telefon VARCHAR,
    email VARCHAR,
    adres TEXT,
    zlecenie_id INT,
    opis TEXT,
    data_zlozenia DATE,
    data_rozpoczecia DATE,
    data_zakonczenia DATE,
    lokalizacja VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.*, 
        z.zlecenie_id, 
        z.opis, 
        z.data_zlozenia, 
        z.data_rozpoczecia, 
        z.data_zakonczenia, 
        z.lokalizacja
    FROM klient k
    LEFT JOIN zlecenie z ON k.klient_id = z.klient_id
    WHERE k.klient_id = klient_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Pobiera informacje o zleceniach wraz z zasobami
-- =========================================
CREATE OR REPLACE FUNCTION get_zlecenie_info(zlecenie_id_param INT)
RETURNS TABLE (
    zlecenie_id INT,
    klient_imie VARCHAR,
    klient_nazwisko VARCHAR,
    klient_firma VARCHAR,
    opis TEXT,
    data_zlozenia DATE,
    data_rozpoczecia DATE,
    data_zakonczenia DATE,
    lokalizacja VARCHAR,
    zasob_nazwa VARCHAR,
    jednostka VARCHAR,
    typ TEXT,
    koszt_jednostkowy DECIMAL,
    magazyn_id INT,
    magazyn_nazwa VARCHAR,
    ilosc INT,
    ilosc_potrzebna INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        z.zlecenie_id,
        k.imie AS klient_imie,
        k.nazwisko AS klient_nazwisko,
        k.firma AS klient_firma,
        z.opis,
        z.data_zlozenia,
        z.data_rozpoczecia,
        z.data_zakonczenia,
        z.lokalizacja,
        zas.nazwa AS zasob_nazwa,
        zas.jednostka,
        zas.typ,
        zas.koszt_jednostkowy,
        mz.magazyn_id,
        m.nazwa AS magazyn_nazwa,
        mz.ilosc,
        zz.ilosc_potrzebna
    FROM zlecenie z
    JOIN klient k ON z.klient_id = k.klient_id
    JOIN zasob_zlecenie zz ON z.zlecenie_id = zz.zlecenie_id
    JOIN magazyn_zasob mz ON zz.magazyn_zasob_id = mz.magazyn_zasob_id
    JOIN zasob zas ON mz.zasob_id = zas.zasob_id
    JOIN magazyn m ON mz.magazyn_id = m.magazyn_id
    WHERE z.zlecenie_id = zlecenie_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Oblicza dodatkowe koszty dla zlecenia na podstawie braków magazynowych
-- =========================================
CREATE OR REPLACE FUNCTION get_dodatkowe_koszty(zlecenie_id_param INT)
RETURNS DECIMAL AS $$
DECLARE
    koszt DECIMAL := 0;
BEGIN
    SELECT 
        SUM((zz.ilosc_potrzebna - mz.ilosc) * zas.koszt_jednostkowy)
    INTO koszt
    FROM zasob_zlecenie zz
    JOIN magazyn_zasob mz using(magazyn_zasob_id)
    JOIN zasob zas using(zasob_id)
    WHERE zz.zlecenie_id = zlecenie_id_param AND zas.typ = 'material';

    RETURN koszt;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Oblicza koszty i godziny pracowników dla zlecenia
-- =========================================
CREATE OR REPLACE FUNCTION get_pracownicy_koszty(zlecenie_id_param INT)
RETURNS TABLE (
    liczba_pracownikow BIGINT,
    przepracowane_godziny DECIMAL,
    koszty_pracownikow DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT dp.pracownik_id) AS liczba_pracownikow,
        SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600) AS przepracowane_godziny_zlecenia,
        SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600 * p.stawka_godzinowa) AS koszty_pracownikow
    FROM dzien_pracy dp
    JOIN pracownik p ON dp.pracownik_id = p.pracownik_id
    WHERE dp.zlecenie_id = zlecenie_id_param
    GROUP BY dp.zlecenie_id;
END;
$$ LANGUAGE plpgsql;



-- Dni pracy


-- Magazyn


-- Stanowiska


-- Zasób







-- znajdz pracownika z danym adresem email
SELECT p.*, s.nazwa as stanowisko FROM pracownik p JOIN stanowisko s using(stanowisko_id) WHERE email = $1
