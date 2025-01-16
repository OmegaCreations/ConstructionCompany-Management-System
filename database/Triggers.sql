-- ==============================================
--      TRIGGERY USUWAJĄCE REKORDY TABLIC
-- ==============================================

-- Trigger przed usunięciem pracownika
CREATE OR REPLACE TRIGGER przed_usunieciem_pracownika
    BEFORE DELETE ON pracownik
    FOR EACH ROW
    EXECUTE FUNCTION usun_pracownika();

-- Trigger przed usunięciem klienta
CREATE TRIGGER przed_usunieciem_klienta
    BEFORE DELETE ON klient
    FOR EACH ROW
    EXECUTE FUNCTION usun_klienta();

-- Trigger przed usunięciem zlecenia
CREATE TRIGGER przed_usunieciem_zlecenia
    BEFORE DELETE ON zlecenie
    FOR EACH ROW
    EXECUTE FUNCTION usun_zlecenie();

-- Trigger przed usunięciem zasobu
CREATE TRIGGER przed_usunieciem_zasobu
    BEFORE DELETE ON zasob
    FOR EACH ROW
    EXECUTE FUNCTION blokuj_usuniecie_zasobu();

-- Trigger przed usunięciem magazynu
CREATE TRIGGER przed_usunieciem_magazynu
    BEFORE DELETE ON magazyn
    FOR EACH ROW
    EXECUTE FUNCTION blokuj_usuniecie_magazynu();


-- ==============================================================================
CREATE OR REPLACE FUNCTION zarzadz_zakupami(p_miesiac DATE) RETURNS void AS $$
DECLARE
    v_zasob_id INT;
    brakujaca_ilosc INT;
    v_zakupy_id INT;
BEGIN
    -- Pobierz ID zakupów dla danego miesiąca lub dodaj nowe
    SELECT zakupy_id INTO v_zakupy_id 
    FROM zakupy z
    WHERE z.miesiac = p_miesiac;

    IF NOT FOUND THEN
        INSERT INTO zakupy (miesiac) 
        VALUES (p_miesiac) 
        RETURNING zakupy_id INTO v_zakupy_id;
    END IF;

    -- Przetwórz zasoby wymagane dla danego miesiąca
    FOR v_zasob_id IN (
        SELECT DISTINCT zzasob.zasob_id
        FROM zasob_zlecenie zzasob
        JOIN zlecenie z ON zzasob.zlecenie_id = z.zlecenie_id
        WHERE z.data_rozpoczecia <= date_trunc('month', p_miesiac) + INTERVAL '1 month' - INTERVAL '1 day'
          AND (z.data_zakonczenia IS NULL OR z.data_zakonczenia >= date_trunc('month', p_miesiac))
    ) LOOP
        -- Oblicz brakującą ilość dla zasobu
        SELECT 
            -- Sumujemy ilość potrzebną ze wszystkich zleceń
            COALESCE(SUM(zzasob.ilosc_potrzebna), 0) 
            -- Odejmujemy ilość zasobu w magazynie (liczymy tylko raz dla każdego zasobu)
            - (SELECT COALESCE(SUM(mz.ilosc), 0) FROM magazyn_zasob mz WHERE mz.zasob_id = v_zasob_id)
        INTO brakujaca_ilosc
        FROM zasob_zlecenie zzasob
        JOIN zlecenie z ON zzasob.zlecenie_id = z.zlecenie_id
        WHERE zzasob.zasob_id = v_zasob_id
          AND z.data_rozpoczecia <= date_trunc('month', p_miesiac) + INTERVAL '1 month' - INTERVAL '1 day'
          AND (z.data_zakonczenia IS NULL OR z.data_zakonczenia >= date_trunc('month', p_miesiac));

        -- Zarządzaj zakupami
        IF brakujaca_ilosc > 0 THEN
            -- Zaktualizuj lub dodaj brakujące zasoby do zakupy_zasob
            INSERT INTO zakupy_zasob (zasob_id, zakupy_id, ilosc)
            VALUES (v_zasob_id, v_zakupy_id, brakujaca_ilosc)
            ON CONFLICT (zasob_id, zakupy_id) DO UPDATE
            SET ilosc = brakujaca_ilosc;
        ELSE
            -- Usuń zasób z listy zakupów, jeśli ilość w magazynie pokrywa zapotrzebowanie
            DELETE FROM zakupy_zasob 
            WHERE zasob_id = v_zasob_id AND zakupy_id = v_zakupy_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;



-- Trigger dla magazyn_zasob
CREATE TRIGGER aktualizacja_zakupow_magazyn
AFTER INSERT OR UPDATE OR DELETE ON magazyn_zasob
FOR EACH ROW
EXECUTE FUNCTION trigger_aktualizacja_zakupow();

-- Trigger dla zasob_zlecenie
CREATE TRIGGER aktualizacja_zakupow_zlecenie
AFTER INSERT OR UPDATE OR DELETE ON zasob_zlecenie
FOR EACH ROW
EXECUTE FUNCTION trigger_aktualizacja_zakupow();



-- =================================================================================================


CREATE OR REPLACE FUNCTION odejmij_zasoby_po_zakonczeniu() RETURNS trigger AS $$
DECLARE
    v_zasob_id INT;
    v_ilosc_potrzebna INT;
    v_suma_dostepna INT;
    v_ilosc_w_magazynie INT;
    v_ilosc_odjete INT;
BEGIN
    -- Sprawdzamy, czy data_zakonczenia zmieniła się z NULL na datę
    IF OLD.data_zakonczenia IS NULL AND NEW.data_zakonczenia IS NOT NULL THEN
        -- Dla każdego zasobu przypisanego do zlecenia
        FOR v_zasob_id, v_ilosc_potrzebna IN
            SELECT zzasob.zasob_id, zzasob.ilosc_potrzebna
            FROM zasob_zlecenie zzasob
            WHERE zzasob.zlecenie_id = NEW.zlecenie_id
        LOOP
            -- Oblicz sumę dostępnych zasobów w magazynach dla danego zasobu
            SELECT COALESCE(SUM(mz.ilosc), 0)
            INTO v_suma_dostepna
            FROM magazyn_zasob mz
            WHERE mz.zasob_id = v_zasob_id;

            -- Jeśli dostępna ilość w magazynach jest mniejsza niż potrzebna, zgłaszamy błąd
            IF v_suma_dostepna < v_ilosc_potrzebna THEN
                RAISE EXCEPTION 'Niewystarczająca ilość zasobów w magazynach dla zasobu %: potrzebna % a dostępna %',
                    v_zasob_id, v_ilosc_potrzebna, v_suma_dostepna;
            END IF;

            -- Odejmiemy zasoby z magazynów, aż pokryjemy zapotrzebowanie
            v_ilosc_odjete := 0;
            FOR v_ilosc_w_magazynie IN
                SELECT mz.ilosc
                FROM magazyn_zasob mz
                WHERE mz.zasob_id = v_zasob_id
                ORDER BY mz.magazyn_id -- Magazyn z mniejszą ilością będzie pierwszy
            LOOP
                -- Obliczamy ile zasobu możemy odjąć z tego magazynu
                IF v_ilosc_odjete + v_ilosc_w_magazynie <= v_ilosc_potrzebna THEN
                    -- Odejmujemy wszystkie dostępne zasoby z magazynu
                    UPDATE magazyn_zasob
                    SET ilosc = ilosc - v_ilosc_w_magazynie
                    WHERE zasob_id = v_zasob_id AND ilosc = v_ilosc_w_magazynie;
                    v_ilosc_odjete := v_ilosc_odjete + v_ilosc_w_magazynie;
                ELSE
                    -- Odejmujemy tylko część zapotrzebowanej ilości
                    UPDATE magazyn_zasob
                    SET ilosc = ilosc - (v_ilosc_potrzebna - v_ilosc_odjete)
                    WHERE zasob_id = v_zasob_id AND ilosc = v_ilosc_w_magazynie;
                    v_ilosc_odjete := v_ilosc_potrzebna;
                    EXIT; -- Zakończymy pętlę, ponieważ już pokryliśmy całe zapotrzebowanie
                END IF;
            END LOOP;

        END LOOP;
    END IF;

    RETURN NEW;
END;	
$$ LANGUAGE plpgsql;

-- Trigger uruchamiany przy zmianie daty zakończenia
CREATE TRIGGER trg_odejmij_zasoby
AFTER UPDATE OF data_zakonczenia
ON zlecenie
FOR EACH ROW
EXECUTE FUNCTION odejmij_zasoby_po_zakonczeniu();


-- ============================================================================================

CREATE OR REPLACE FUNCTION sprawdz_dostepnosc_sprzetu()
RETURNS TRIGGER AS $$
DECLARE
    calkowita_ilosc INT;  -- Ilość sprzętu w magazynach
    ilosc_w_uzyciu INT;   -- Ilość sprzętu używanego w tym samym okresie
    typ_zasobu TEXT;      -- Typ zasobu (sprzęt/materiał)
    poczatek_okresu DATE; -- Początek przedziału czasowego
    koniec_okresu DATE;   -- Koniec przedziału czasowego
BEGIN
    -- Pobranie typu zasobu
    SELECT typ INTO typ_zasobu
    FROM zasob
    WHERE zasob_id = NEW.zasob_id;

    -- Sprawdzaj tylko zasoby typu 'sprzęt'
    IF typ_zasobu != 'sprzet' THEN
        RETURN NEW;
    END IF;

    -- Pobranie dat zlecenia
    SELECT data_rozpoczecia, data_zakonczenia
    INTO poczatek_okresu, koniec_okresu
    FROM zlecenie
    WHERE zlecenie_id = NEW.zlecenie_id;

    -- Jeśli brak daty zakończenia, ustaw koniec na ostatni dzień bieżącego miesiąca
    IF koniec_okresu IS NULL THEN
        koniec_okresu := date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day';
    END IF;

    -- Oblicz całkowitą ilość sprzętu w magazynach
    SELECT COALESCE(SUM(mz.ilosc), 0)
    INTO calkowita_ilosc
    FROM magazyn_zasob mz
    WHERE mz.zasob_id = NEW.zasob_id;

    -- Oblicz ilość sprzętu w użyciu w tym samym przedziale czasowym, wykluczając bieżący rekord podczas UPDATE
    SELECT COALESCE(SUM(zzasob.ilosc_potrzebna), 0)
    INTO ilosc_w_uzyciu
    FROM zasob_zlecenie zzasob
    JOIN zlecenie z ON zzasob.zlecenie_id = z.zlecenie_id
    WHERE zzasob.zasob_id = NEW.zasob_id
      AND z.data_rozpoczecia <= koniec_okresu
      AND (z.data_zakonczenia IS NULL OR z.data_zakonczenia >= poczatek_okresu)
      AND (TG_OP = 'INSERT' OR zzasob.zlecenie_id != NEW.zlecenie_id);

    -- Sprawdź, czy wystarczy sprzętu
    IF calkowita_ilosc - ilosc_w_uzyciu < NEW.ilosc_potrzebna THEN
        RAISE EXCEPTION 'Brak wystarczającej ilości sprzętu w magazynach lub sprzęt jest już w użyciu w tym okresie.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger wywołujący funkcję przy dodawaniu/aktualizacji zasobu do zlecenia
CREATE OR REPLACE TRIGGER sprawdz_sprzet_trigger
BEFORE INSERT OR UPDATE ON zasob_zlecenie
FOR EACH ROW
EXECUTE FUNCTION sprawdz_dostepnosc_sprzetu();


-- =========================================================================

-- Funkcja do obsługi logiki triggera
CREATE OR REPLACE FUNCTION update_or_insert_zasob_zlecenie()
RETURNS TRIGGER AS $$
BEGIN
    -- Sprawdź, czy rekord już istnieje
    IF EXISTS (
        SELECT 1
        FROM zasob_zlecenie
        WHERE zasob_id = NEW.zasob_id AND zlecenie_id = NEW.zlecenie_id
    ) THEN
        -- Jeśli istnieje, zaktualizuj ilość
        UPDATE zasob_zlecenie
        SET ilosc_potrzebna = ilosc_potrzebna + NEW.ilosc_potrzebna
        WHERE zasob_id = NEW.zasob_id AND zlecenie_id = NEW.zlecenie_id;
        RETURN NULL; -- Nie dodawaj nowego rekordu
    ELSE
        -- Jeśli nie istnieje, wstaw nowy rekord
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_or_insert_zasob_zlecenie
BEFORE INSERT ON zasob_zlecenie
FOR EACH ROW
EXECUTE FUNCTION update_or_insert_zasob_zlecenie();
