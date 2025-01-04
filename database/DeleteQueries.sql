-- Funkcja do usuwania stanowiska
CREATE OR REPLACE FUNCTION usun_stanowisko(stanowisko_id INT) RETURNS VOID AS $$
BEGIN
    -- Sprawdzamy, czy stanowisko ma przypisanych pracowników
    IF EXISTS (SELECT 1 FROM pracownik WHERE stanowisko_id = stanowisko_id) THEN
        RAISE EXCEPTION 'Nie można usunąć stanowiska, ponieważ ma przypisanych pracowników.';
    END IF;
    
    -- Usuwamy stanowisko
    DELETE FROM stanowisko WHERE stanowisko_id = stanowisko_id;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania pracownika
CREATE OR REPLACE FUNCTION usun_pracownika(pracownik_id INT) RETURNS VOID AS $$
BEGIN
    -- Sprawdzamy, czy pracownik ma przypisane nieukończone dni pracy
    IF EXISTS (SELECT 1 FROM dzien_pracy WHERE pracownik_id = pracownik_id AND godzina_zakonczenia IS NULL) THEN
        RAISE EXCEPTION 'Nie można usunąć pracownika, ponieważ ma przypisane nieukończone dni pracy.';
    END IF;

    -- Usuwamy pracownika
    DELETE FROM pracownik WHERE pracownik_id = pracownik_id;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania klienta
CREATE OR REPLACE FUNCTION usun_klienta(klient_id INT) RETURNS VOID AS $$
BEGIN
    -- Sprawdzamy, czy klient ma nieukończone zlecenia
    IF EXISTS (SELECT 1 FROM zlecenie WHERE klient_id = klient_id AND data_zakonczenia IS NULL) THEN
        RAISE EXCEPTION 'Nie można usunąć klienta, ponieważ ma nieukończone zlecenia.';
    END IF;

    -- Usuwamy klienta
    DELETE FROM klient WHERE klient_id = klient_id;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania zlecenia
CREATE OR REPLACE FUNCTION usun_zlecenie(zlecenie_id INT) RETURNS VOID AS $$
BEGIN
    -- Sprawdzamy, czy zlecenie ma przypisane zasoby
    IF EXISTS (SELECT 1 FROM zasob_zlecenie WHERE zlecenie_id = zlecenie_id) THEN
        RAISE EXCEPTION 'Nie można usunąć zlecenia, ponieważ są przypisane zasoby.';
    END IF;

    -- Usuwamy zlecenie
    DELETE FROM zlecenie WHERE zlecenie_id = zlecenie_id;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania zasobu
CREATE OR REPLACE FUNCTION usun_zasob(zasob_id INT) RETURNS VOID AS $$
BEGIN
    -- Sprawdzamy, czy zasób jest używany w magazynie
    IF EXISTS (SELECT 1 FROM magazyn_zasob WHERE zasob_id = zasob_id) THEN
        RAISE EXCEPTION 'Nie można usunąć zasobu, ponieważ jest używany w magazynie.';
    END IF;
    
    -- Sprawdzamy, czy zasób jest przypisany do zlecenia
    IF EXISTS (SELECT 1 FROM zasob_zlecenie WHERE zasob_id = zasob_id) THEN
        RAISE EXCEPTION 'Nie można usunąć zasobu, ponieważ jest przypisany do zlecenia.';
    END IF;

    -- Usuwamy zasób
    DELETE FROM zasob WHERE zasob_id = zasob_id;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania magazynu
CREATE OR REPLACE FUNCTION usun_magazyn(magazyn_id INT) RETURNS VOID AS $$
BEGIN
    -- Sprawdzamy, czy magazyn nie jest pusty
    IF EXISTS (SELECT 1 FROM magazyn_zasob WHERE magazyn_id = magazyn_id) THEN
        RAISE EXCEPTION 'Nie można usunąć magazynu, ponieważ nie jest pusty.';
    END IF;

    -- Usuwamy magazyn
    DELETE FROM magazyn WHERE magazyn_id = magazyn_id;
END;
$$ LANGUAGE plpgsql;
