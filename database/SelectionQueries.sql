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
-- Funkcja: Pobiera informacje o zleceniach
-- =========================================
CREATE OR REPLACE FUNCTION get_zlecenie_info(zlecenie_id_param INT DEFAULT NULL)
RETURNS TABLE (
    zlecenie_id INT,
    klient_imie VARCHAR,
    klient_nazwisko VARCHAR,
    klient_firma VARCHAR,
    opis TEXT,
    data_zlozenia DATE,
    data_rozpoczecia DATE,
    data_zakonczenia DATE,
    lokalizacja VARCHAR
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
        z.lokalizacja
    FROM zlecenie z
    JOIN klient k ON z.klient_id = k.klient_id
    WHERE zlecenie_id_param IS NULL OR z.zlecenie_id = zlecenie_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Pobiera informacje o zasobach danego zlecenia
-- =========================================
CREATE OR REPLACE FUNCTION get_zlecenie_zasoby(zlecenie_id_param INT)
RETURNS TABLE (
    zlecenie_id INT,
    zasob_id INT,
    nazwa_zasobu VARCHAR,
    jednostka VARCHAR,
    typ TEXT,
    koszt_jednostkowy NUMERIC,
    ilosc_potrzebna INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        z.zlecenie_id,
        mz.zasob_id,
        r.nazwa,
        r.jednostka,
        r.typ,
        r.koszt_jednostkowy,
        zz.ilosc_potrzebna
    FROM zasob_zlecenie zz
    JOIN magazyn_zasob mz using(magazyn_zasob_id)
    JOIN zasob r using(zasob_id)
    JOIN zlecenie z using(zlecenie_id)
    WHERE zz.zlecenie_id = zlecenie_id_param;
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

    IF koszt IS NULL OR koszt < 0 THEN
        koszt := 0;
    END;

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
        COALESCE(COUNT(DISTINCT dp.pracownik_id), 0) AS liczba_pracownikow,
        COALESCE(SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600), 0) AS przepracowane_godziny,
        COALESCE(SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600 * p.stawka_godzinowa), 0) AS koszty_pracownikow
    FROM dzien_pracy dp
    JOIN pracownik p ON dp.pracownik_id = p.pracownik_id
    WHERE dp.zlecenie_id = zlecenie_id_param
    GROUP BY dp.zlecenie_id;
END;
$$ LANGUAGE plpgsql;


-- =========================================
--                Dni pracy
-- =========================================

-- =========================================
-- Funkcja: Zwraca dni pracy dla danego miesiąca i roku
-- =========================================
CREATE OR REPLACE FUNCTION get_dzienpracy_by_month(year_param INT, month_param INT, pracownik_id_param INT DEFAULT NULL)
RETURNS TABLE (
    pracownik_id INT,
    zlecenie_id INT,
    data DATE,
    godzina_rozpoczecia TIME,
    godzina_zakonczenia TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        dp.pracownik_id,
        dp.zlecenie_id,
        dp.data,
        dp.godzina_rozpoczecia,
        dp.godzina_zakonczenia
    FROM dzien_pracy dp
    WHERE EXTRACT(YEAR FROM dp.data) = year_param
      AND EXTRACT(MONTH FROM dp.data) = month_param
      AND pracownik_id_param IS NULL OR dp.pracownik_id = pracownik_id_param;
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Funkcja: Zwraca dni pracy dla danej daty
-- =========================================
CREATE OR REPLACE FUNCTION get_dzienpracy_by_date(pracownik_id_param INT, year_param INT, month_param INT, day_param INT)
RETURNS TABLE (
    pracownik_id INT,
    zlecenie_id INT,
    data DATE,
    godzina_rozpoczecia TIME,
    godzina_zakonczenia TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp.pracownik_id,
        dp.zlecenie_id,
        dp.data,
        dp.godzina_rozpoczecia,
        dp.godzina_zakonczenia
    FROM dzien_pracy dp
    WHERE EXTRACT(YEAR FROM dp.data) = year_param
      AND EXTRACT(MONTH FROM dp.data) = month_param
      AND EXTRACT(DAY FROM dp.data) = day_param
      AND dp.pracownik_id = pracownik_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
--                Magazyn
-- =========================================

-- =========================================
-- Funkcja: Zwraca wszystkie magazyny
-- =========================================
CREATE OR REPLACE FUNCTION get_magazyny()
RETURNS TABLE (
    magazyn_id INT,
    nazwa VARCHAR,
    lokalizacja TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        magazyn_id,
        nazwa,
        lokalizacja
    FROM magazyn;
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Funkcja: Zwraca wszystkie zasoby danego magazynu
-- =========================================
CREATE OR REPLACE FUNCTION get_zasoby_magazynu(magazyn_id_param INT)
RETURNS TABLE (
    magazyn_zasob_id INT,
    zasob_id INT,
    nazwa_zasobu VARCHAR,
    jednostka VARCHAR,
    typ VARCHAR,
    ilosc INT,
    koszt_jednostkowy DECIMAL,
    opis TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mz.magazyn_zasob_id,
        z.zasob_id,
        z.nazwa AS nazwa_zasobu,
        z.jednostka,
        z.typ,
        mz.ilosc,
        z.koszt_jednostkowy,
        z.opis
    FROM magazyn_zasob mz
    JOIN zasob z ON mz.zasob_id = z.zasob_id
    WHERE mz.magazyn_id = magazyn_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Zwraca wszystkie zasoby magazynu dla widoku pracownika (bez kosztów jednostkowych)
-- =========================================
CREATE OR REPLACE FUNCTION get_zasoby_magazynu_pracownik(magazyn_id_param INT)
RETURNS TABLE (
    magazyn_id INT,
    nazwa_magazynu VARCHAR,
    zasob_id INT,
    nazwa_zasobu VARCHAR,
    jednostka VARCHAR,
    typ VARCHAR,
    ilosc INT,
    opis TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        magazyn_id,
        nazwa_magazynu,
        zasob_id,
        nazwa_zasobu,
        jednostka,
        typ,
        ilosc,
        opis
    FROM view_zasoby_magazynu_pracownik
    WHERE magazyn_id = magazyn_id_param;
END;
$$ LANGUAGE plpgsql;


-- Stanowiska


-- Zasób







-- znajdz pracownika z danym adresem email
SELECT p.*, s.nazwa as stanowisko FROM pracownik p JOIN stanowisko s using(stanowisko_id) WHERE email = $1
