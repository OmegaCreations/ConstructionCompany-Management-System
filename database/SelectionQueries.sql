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
        s.nazwa AS stanowisko_nazwa
    FROM pracownik p
    JOIN stanowisko s ON p.stanowisko_id = s.stanowisko_id
    WHERE pracownik_id_param IS NULL OR p.pracownik_id = pracownik_id_param;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Funkcja: Oblicza przepracowane godziny i status wypłaty dla pracownika
-- =========================================
CREATE OR REPLACE FUNCTION get_wyplata_status(pracownik_id_param INT)
RETURNS TABLE (
    przepracowane_godziny DECIMAL,
    wyplata_status DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600) AS przepracowane_godziny,
        SUM(EXTRACT(EPOCH FROM (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600) * p.stawka_godzinowa AS wyplata_status
    FROM dzien_pracy dp
    JOIN pracownik p ON dp.pracownik_id = p.pracownik_id
    WHERE p.pracownik_id = pracownik_id_param
    GROUP BY p.stawka_godzinowa;
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







-- =========================================
-- pracownicy i ich stanowiska
-- =========================================
select p.pracownik_id, p.imie, p.nazwisko, p.telefon, p.email, p.stawka_godzinowa, s.nazwa as stanowisko
    from pracownik p
        join stanowisko s on p.stanowisko_id = s.stanowisko_id; -- mozna tutaj zmienic na konkretne stanowisko w razie potrzeby


-- =========================================
-- wszystkie zlecenia od danego klienta
-- =========================================
select z.zlecenie_id, z.opis, z.data_zlozenia, z.data_rozpoczecia, z.data_zakonczenia, z.lokalizacja,
       k.imie as klient_imie, k.nazwisko as klient_nazwisko, k.firma as klient_firma, k.telefon as klient_telefon
from zlecenie z
    join klient k on z.klient_id = k.klient_id;


-- =========================================
-- wszystkie dni pracy pracowników dla danego zlecenia
-- =========================================
select dp.data, dp.godzina_rozpoczecia, dp.godzina_zakonczenia,
       p.imie, p.nazwisko, z.opis as zlecenie
    from dzien_pracy dp
        join pracownik p on dp.pracownik_id = p.pracownik_id
        join zlecenie z on dp.zlecenie_id = z.zlecenie_id
where z.zlecenie_id = 1; 


-- =========================================
-- lista sprzętu w magazynach
-- =========================================
select m.nazwa as magazyn, m.lokalizacja, s.nazwa as sprzet, s.opis, ms.ilosc
    from magazyn_sprzet ms
        join magazyn m on ms.magazyn_id = m.magazyn_id
        join sprzet s on ms.sprzet_id = s.sprzet_id;


-- =========================================
-- aktualne koszty wynagrodzenia pracowników dla danego zlecenia
-- =========================================
select z.opis as zlecenie, sum(extract(epoch from (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600 * p.stawka_godzinowa) as koszt_pracy
    from dzien_pracy dp
        join pracownik p on dp.pracownik_id = p.pracownik_id
        join zlecenie z on dp.zlecenie_id = z.zlecenie_id
group by z.zlecenie_id, z.opis;


-- =========================================
-- aktualna ilosc godzin pracy pracowników dla danego zlecenia
-- =========================================
select p.imie, p.nazwisko, z.opis as zlecenie,
        sum(extract(epoch from (dp.godzina_zakonczenia - dp.godzina_rozpoczecia)) / 3600) as przepracowane_godziny
    from dzien_pracy dp
        join pracownik p on dp.pracownik_id = p.pracownik_id
        join zlecenie z on dp.zlecenie_id = z.zlecenie_id
group by p.pracownik_id, p.imie, p.nazwisko, z.zlecenie_id, z.opis;


-- =========================================
-- sprzęt wymagany do realizacji zlecenia wraz z brakami
-- =========================================
select z.opis as zlecenie, s.nazwa as sprzet, sz.ilosc_potrzebna, (sz.ilosc_potrzebna - sz.ilosc_zapewniona) as brakujace
    from sprzet_zlecenie sz
        join sprzet s on sz.sprzet_id = s.sprzet_id
        join zlecenie z on sz.zlecenie_id = z.zlecenie_id
where sz.ilosc_zapewniona < sz.ilosc_potrzebna;