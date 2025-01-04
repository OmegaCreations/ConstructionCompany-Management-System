-- funkcja czyszcząca bazę danych
CREATE OR REPLACE FUNCTION truncate_schema() RETURNS void AS $$
DECLARE
    tabela TEXT;
BEGIN
    FOR tabela IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'construction_company' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('TRUNCATE TABLE %I.%I RESTART IDENTITY CASCADE;', 'construction_company', tabela);
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- rozwiązanie problemu że użytkownik nie ma uprawnień do pg_tables

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
CREATE OR REPLACE FUNCTION usun_pracownika()
RETURNS TRIGGER AS $$
BEGIN
    -- Usuń dni pracy powiązane z pracownikiem
    DELETE FROM dzien_pracy WHERE pracownik_id = OLD.pracownik_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania klienta
CREATE OR REPLACE FUNCTION usun_klienta()
RETURNS TRIGGER AS $$
BEGIN
    -- Usuń wszystkie zlecenia powiązane z klientem
    DELETE FROM dzien_pracy WHERE zlecenie_id IN (
        SELECT zlecenie_id FROM zlecenie WHERE klient_id = OLD.klient_id
    );
    DELETE FROM zasob_zlecenie WHERE zlecenie_id IN (
        SELECT zlecenie_id FROM zlecenie WHERE klient_id = OLD.klient_id
    );
    DELETE FROM zlecenie WHERE klient_id = OLD.klient_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do usuwania zlecenia
CREATE OR REPLACE FUNCTION usun_zlecenie()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.data_zakonczenia IS NULL THEN
        RAISE EXCEPTION 'Nie można usunąć zlecenia, ponieważ nie jest ono jeszcze ukończone.';
    END IF;

    DELETE FROM zakupy_zasob WHERE zlecenie_id = OLD.zlecenie_id;
    DELETE FROM dzien_pracy WHERE zlecenie_id = OLD.zlecenie_id;
    DELETE FROM zasob_zlecenie WHERE zlecenie_id = OLD.zlecenie_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
   

-- Funkcja do usuwania zasobu
CREATE OR REPLACE FUNCTION blokuj_usuniecie_zasobu()
RETURNS TRIGGER AS $$
BEGIN
    -- Sprawdź, czy zasób jest używany w zleceniu
    IF EXISTS (
        SELECT 1 FROM zasob_zlecenie WHERE zasob_id = OLD.zasob_id
    ) THEN
        RAISE EXCEPTION 'Nie można usunąć zasobu, ponieważ jest on używany w zleceniu.';
    END IF;

    -- Sprawdź, czy zasób jest w magazynie
    IF EXISTS (
        SELECT 1 FROM magazyn_zasob WHERE zasob_id = OLD.zasob_id
    ) THEN
        RAISE EXCEPTION 'Nie można usunąć zasobu, ponieważ znajduje się w magazynie.';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


-- Funkcja do usuwania magazynu
CREATE OR REPLACE FUNCTION blokuj_usuniecie_magazynu()
RETURNS TRIGGER AS $$
BEGIN
    -- Sprawdź, czy magazyn nie jest pusty
    IF EXISTS (
        SELECT 1 FROM magazyn_zasob WHERE magazyn_id = OLD.magazyn_id
    ) THEN
        RAISE EXCEPTION 'Nie można usunąć magazynu, ponieważ nie jest pusty.';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;