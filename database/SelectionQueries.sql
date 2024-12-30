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
    ilosc_potrzebna INT,
    ilosc_w_magazynie BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        z.zlecenie_id,
        r.zasob_id,
        r.nazwa,
        r.jednostka,
        r.typ,
        r.koszt_jednostkowy,
        zz.ilosc_potrzebna,
        COALESCE(SUM(mz.ilosc), 0) AS ilosc_w_magazynie
    FROM zasob_zlecenie zz
    JOIN zlecenie z ON zz.zlecenie_id = z.zlecenie_id
    JOIN zasob r ON zz.magazyn_zasob_id IS NOT NULL AND r.zasob_id = (SELECT mz2.zasob_id FROM magazyn_zasob mz2 WHERE mz2.magazyn_zasob_id = zz.magazyn_zasob_id)
    LEFT JOIN magazyn_zasob mz ON r.zasob_id = mz.zasob_id
    WHERE zz.zlecenie_id = zlecenie_id_param
    GROUP BY z.zlecenie_id, r.zasob_id, r.nazwa, r.jednostka, r.typ, r.koszt_jednostkowy, zz.ilosc_potrzebna;
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
    END IF;

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
    pracownik_imie VARCHAR,
    pracownik_nazwisko VARCHAR,
    zlecenie_id INT,
    zlecenie_opis TEXT,
    zlecenie_lokalizacja VARCHAR,
    klient_imie VARCHAR,
    klient_nazwisko VARCHAR,
    klient_firma VARCHAR,
    opis_pracownika TEXT,
    opis_managera TEXT,
    data DATE,
    godzina_rozpoczecia TIME,
    godzina_zakonczenia TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        dp.pracownik_id,
        p.imie AS pracownik_imie,
        p.nazwisko AS pracownik_nazwisko,
        dp.zlecenie_id,
        z.opis AS zlecenie_opis,
        z.lokalizacja AS zlecenie_lokalizacja,
        k.imie AS klient_imie,
        k.nazwisko AS klient_nazwisko,
        k.firma AS klient_firma,
        dp.opis_pracownika,
        dp.opis_managera,
        dp.data,
        dp.godzina_rozpoczecia,
        dp.godzina_zakonczenia
    FROM dzien_pracy dp
    JOIN pracownik p ON dp.pracownik_id = p.pracownik_id
    JOIN zlecenie z ON dp.zlecenie_id = z.zlecenie_id
    JOIN klient k ON z.klient_id = k.klient_id
    WHERE EXTRACT(YEAR FROM dp.data) = year_param
      AND EXTRACT(MONTH FROM dp.data) = month_param
      AND (pracownik_id_param IS NULL OR dp.pracownik_id = pracownik_id_param);
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Funkcja: Zwraca dni pracy dla danej daty
-- =========================================
CREATE OR REPLACE FUNCTION get_dzienpracy_by_date(pracownik_id_param INT, year_param INT, month_param INT, day_param INT)
RETURNS TABLE (
    pracownik_id INT,
    pracownik_imie VARCHAR,
    pracownik_nazwisko VARCHAR,
    zlecenie_id INT,
    zlecenie_opis TEXT,
    zlecenie_lokalizacja VARCHAR,
    klient_imie VARCHAR,
    klient_nazwisko VARCHAR,
    klient_firma VARCHAR,
    opis_pracownika TEXT,
    opis_managera TEXT,
    data DATE,
    godzina_rozpoczecia TIME,
    godzina_zakonczenia TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        dp.pracownik_id,
        p.imie AS pracownik_imie,
        p.nazwisko AS pracownik_nazwisko,
        dp.zlecenie_id,
        z.opis AS zlecenie_opis,
        z.lokalizacja AS zlecenie_lokalizacja,
        k.imie AS klient_imie,
        k.nazwisko AS klient_nazwisko,
        k.firma AS klient_firma,
        dp.opis_pracownika,
        dp.opis_managera,
        dp.data,
        dp.godzina_rozpoczecia,
        dp.godzina_zakonczenia
    FROM dzien_pracy dp
    JOIN pracownik p ON dp.pracownik_id = p.pracownik_id
    JOIN zlecenie z ON dp.zlecenie_id = z.zlecenie_id
    JOIN klient k ON z.klient_id = k.klient_id
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
    lokalizacja VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.magazyn_id,
        m.nazwa,
        m.lokalizacja
    FROM magazyn m;
END;
$$ LANGUAGE plpgsql;
select * from get_magazyny();



-- =========================================
-- Funkcja: Zwraca wszystkie zasoby danego magazynu
-- =========================================
CREATE OR REPLACE FUNCTION get_zasoby_magazynu(magazyn_id_param INT)
RETURNS TABLE (
    magazyn_zasob_id INT,
    zasob_id INT,
    nazwa_zasobu VARCHAR,
    jednostka VARCHAR,
    typ TEXT,
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
    typ TEXT,
    ilosc INT,
    opis TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.magazyn_id,
        v.nazwa_magazynu,
        v.zasob_id,
        v.nazwa_zasobu,
        v.jednostka,
        v.typ,
        v.ilosc,
        v.opis
    FROM view_zasoby_magazynu_pracownik v
    WHERE v.magazyn_id = magazyn_id_param;
END;
$$ LANGUAGE plpgsql;


-- Stanowiska
CREATE OR REPLACE FUNCTION get_stanowiska()
RETURNS TABLE (
    stanowisko_id INT,
    nazwa VARCHAR,
    opis TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.stanowisko_id,
        s.nazwa,
        s.opis
    FROM stanowisko s;
END;
$$ LANGUAGE plpgsql;


-- Zasób
CREATE OR REPLACE FUNCTION get_zasoby()
RETURNS TABLE (
    zasob_id INT,
    nazwa VARCHAR,
    jednostka VARCHAR,
    typ TEXT,
    opis TEXT,
    koszt_jednostkowy DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        z.zasob_id,
        z.nazwa,
        z.jednostka,
        z.typ,
        z.opis,
        z.koszt_jednostkowy
    FROM zasob z;
END;
$$ LANGUAGE plpgsql;


-- ZAKUPY DO ZROBIENIA NA DANY MIESIĄC
CREATE OR REPLACE FUNCTION get_zakupy(p_month DATE)
RETURNS TABLE (
    nazwa_zasobu VARCHAR(50),
    koszt_jednostkowy DECIMAL,
    ilosc INT,
    suma_kosztow DECIMAL,
    nazwa_firmy VARCHAR(50),
    data_rozpoczecia DATE,
    opis_zlecenia TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        z.nazwa AS nazwa_zasobu,
        z.koszt_jednostkowy,
        zz.ilosc,
        z.koszt_jednostkowy * zz.ilosc AS suma_kosztow,
        k.firma AS nazwa_firmy,
        zl.data_rozpoczecia,
        zl.opis AS opis_zlecenia
    FROM 
        zakupy za
    JOIN 
        zakupy_zasob zz ON za.zakupy_id = zz.zakupy_id
    JOIN 
        zasob z ON zz.zasob_id = z.zasob_id
    JOIN 
        zlecenie zl ON zz.zlecenie_id = zl.zlecenie_id
    JOIN 
        klient k ON zl.klient_id = k.klient_id
    WHERE 
        DATE_TRUNC('month', za.miesiac) = DATE_TRUNC('month', p_month);
END;
$$ LANGUAGE plpgsql;




-- znajdz pracownika z danym adresem email
SELECT p.*, s.nazwa as stanowisko FROM pracownik p JOIN stanowisko s using(stanowisko_id) WHERE email = $1
