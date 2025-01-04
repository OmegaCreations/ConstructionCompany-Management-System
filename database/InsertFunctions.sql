
-- ==================================================================================
--              PONIZEJ SA FUNKCJE KTORE BEDA DODAWAC ODPOWIEDNIE OBIEKTY
-- ==================================================================================

-- dodawanie zasobu do magazynu
CREATE OR REPLACE FUNCTION dodaj_zasob_do_magazynu(p_ilosc INT, p_magazyn_id INT, p_zasob_id INT)
RETURNS VOID AS $$
BEGIN
    -- sprawdzamy czy już jest w magazynie ten zasób
    IF EXISTS (
        SELECT 1
        FROM magazyn_zasob mz
        WHERE mz.magazyn_id = p_magazyn_id
          AND mz.zasob_id = p_zasob_id
    ) THEN
        -- jeśli tak to aktualizujemy ilość
        UPDATE magazyn_zasob mz
        SET ilosc = ilosc + p_ilosc
        WHERE mz.magazyn_id = p_magazyn_id
          AND mz.zasob_id = p_zasob_id;
    ELSE
        -- jeśli nie to dodajemy nowy rekord
        INSERT INTO magazyn_zasob (ilosc, magazyn_id, zasob_id)
        VALUES (p_ilosc, p_magazyn_id, p_zasob_id);
    END IF;
END;
$$ LANGUAGE plpgsql;


-- dodawanie zlecenia
CREATE OR REPLACE FUNCTION dodaj_zlecenie(
    p_klient_id INT,
    p_opis TEXT,
    p_data_zlozenia DATE,
    p_data_rozpoczecia DATE,
    p_lokalizacja VARCHAR,
    p_wycena DECIMAL DEFAULT 0,
    p_data_zakonczenia DATE DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_zlecenie_id INT;
BEGIN
    -- Sprawdzenie czy klient istnieje
    IF NOT EXISTS (SELECT 1 FROM klient k WHERE k.klient_id = p_klient_id) THEN
        RAISE EXCEPTION 'Klient o ID % nie istnieje.', p_klient_id;
    END IF;

    -- Wstawienie zlecenia i zwrócenie ID
    INSERT INTO zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, lokalizacja, wycena, data_zakonczenia)
    VALUES (p_klient_id, p_opis, p_data_zlozenia, p_data_rozpoczecia, p_lokalizacja, p_wycena, p_data_zakonczenia);
END;
$$ LANGUAGE plpgsql;



-- funkcja dodająca wymagane zasoby do zlecenia
CREATE OR REPLACE FUNCTION dodaj_zasob_do_zlecenia(
    p_zlecenie_id INT,
    p_zasob_id INT,
    p_ilosc_potrzebna INT
)
RETURNS VOID AS $$ 
BEGIN
    -- sprawdzenie czy zlecenie istnieje 
    IF NOT EXISTS (SELECT 1 FROM zlecenie WHERE zlecenie_id = p_zlecenie_id) THEN 
        RAISE EXCEPTION 'Zlecenie o ID % nie istnieje.', p_zlecenie_id; 
    END IF; 

    -- sprawdzenie czy zasób istnieje 
    IF NOT EXISTS (SELECT 1 FROM zasob WHERE zasob_id = p_zasob_id) THEN 
        RAISE EXCEPTION 'Zasób o ID % nie istnieje.', p_zasob_id; 
    END IF; 

    -- wstawienie lub aktualizacja zasobu w zleceniu 
    INSERT INTO zasob_zlecenie (zasob_id, zlecenie_id, ilosc_potrzebna) 
    VALUES (p_zasob_id, p_zlecenie_id, p_ilosc_potrzebna) 
    ON CONFLICT (zasob_id, zlecenie_id) 
    DO UPDATE SET ilosc_potrzebna = EXCLUDED.ilosc_potrzebna;
END;
$$ LANGUAGE plpgsql;


-- funkcja dodająca dzień pracy dla pracownika
CREATE OR REPLACE FUNCTION dodaj_dzien_pracy(
    p_pracownik_id INT,
    p_zlecenie_id INT,
    p_data DATE,
    p_opis_managera TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- sprawdzenie czy zlecenie i pracownik istnieją
    IF NOT EXISTS (SELECT 1 FROM pracownik WHERE pracownik_id = p_pracownik_id) THEN
        RAISE EXCEPTION 'Pracownik o ID % nie istnieje.', p_pracownik_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM zlecenie WHERE zlecenie_id = p_zlecenie_id) THEN
        RAISE EXCEPTION 'Zlecenie o ID % nie istnieje.', p_zlecenie_id;
    END IF;

    -- dodanie dnia pracy tylko jeśli nie istnieje taki wpis
    INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data, opis_managera)
    VALUES (p_pracownik_id, p_zlecenie_id, p_data, p_opis_managera)
    ON CONFLICT (pracownik_id, zlecenie_id, data) DO NOTHING; -- nie chcemy dodawać jeśli już jest taki dzień, zlecenie i pracownik
END;
$$ LANGUAGE plpgsql;