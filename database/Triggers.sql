-- ================================================================
--      Funkcja która aktualizuje listę zakupów na dany miesiąc.
-- ================================================================

CREATE OR REPLACE FUNCTION update_zasob_on_change_zasob_zlecenie()
RETURNS TRIGGER AS $$
DECLARE
    dodatkowe_koszty DECIMAL;
    zakup_id INT;
    data_rozpoczecia DATE;
BEGIN
    -- Obsługuje INSERT oraz UPDATE w zasob_zlecenie
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

        
        -- Pobieramy datę rozpoczęcia zlecenia
        SELECT z.data_rozpoczecia INTO data_rozpoczecia
        FROM zlecenie z
        WHERE z.zlecenie_id = NEW.zlecenie_id;

        -- Dodajemy zakupy (wpis do tabeli zakupy), jeśli nie ma zakupów na dany miesiąc
        INSERT INTO zakupy (miesiac)
        VALUES (date_trunc('month', data_rozpoczecia))
        ON CONFLICT (miesiac) DO NOTHING
        RETURNING zakupy_id INTO zakup_id;

        -- Szukamy zakupu, jeśli był konflikt (miesiąc już istnieje)
        IF zakup_id IS NULL THEN
            SELECT zakupy_id INTO zakup_id
            FROM zakupy
            WHERE miesiac = date_trunc('month', data_rozpoczecia);
        END IF;

        -- Dodajemy zasoby do zakupu
        INSERT INTO zakupy_zasob (zasob_id, zakupy_id, zlecenie_id, ilosc)
        SELECT mz.zasob_id, zakup_id, zz.zlecenie_id, (zz.ilosc_potrzebna - COALESCE(mz.ilosc, 0))
        FROM zasob_zlecenie zz
        LEFT JOIN magazyn_zasob mz ON zz.magazyn_zasob_id = mz.magazyn_zasob_id
        WHERE zz.zlecenie_id = NEW.zlecenie_id
        AND (zz.ilosc_potrzebna - COALESCE(mz.ilosc, 0)) > 0
        ON CONFLICT (zasob_id, zakupy_id, zlecenie_id)
        DO UPDATE SET ilosc = zakupy_zasob.ilosc + EXCLUDED.ilosc;

        -- Usuwamy zasoby z zakupu, jeśli już mamy wystarczającą ilość materiałów w magazynie
        DELETE FROM zakupy_zasob
        WHERE zasob_id IN (
            SELECT mz.zasob_id
            FROM zasob_zlecenie zz
            JOIN magazyn_zasob mz ON zz.magazyn_zasob_id = mz.magazyn_zasob_id
            WHERE zz.zlecenie_id = NEW.zlecenie_id
            AND mz.ilosc >= zz.ilosc_potrzebna
        )
        AND zlecenie_id = NEW.zlecenie_id;

    -- DELETE w zasob_zlecenie
    ELSIF TG_OP = 'DELETE' THEN
        -- Pobieramy datę rozpoczęcia zlecenia
        SELECT z.data_rozpoczecia INTO data_rozpoczecia
        FROM zlecenie z
        WHERE z.zlecenie_id = OLD.zlecenie_id;

        -- Aktualizujemy ilości zakupów w zakupy_zasob na podstawie zmiany w magazynie
        UPDATE zakupy_zasob
        SET ilosc = ilosc - OLD.ilosc_potrzebna
        WHERE zasob_id = OLD.zasob_id
        AND zlecenie_id = OLD.zlecenie_id
        AND zakupy_id IN (
            SELECT zakupy_id
            FROM zakupy
            WHERE miesiac = date_trunc('month', data_rozpoczecia)
        );

        -- Usuwamy zakupy_zasob, jeśli ilość w magazynie wystarczy na wszystkie zlecenia
        DELETE FROM zakupy_zasob
        WHERE zasob_id IN (
            SELECT mz.zasob_id
            FROM zasob_zlecenie zz
            JOIN magazyn_zasob mz ON zz.magazyn_zasob_id = mz.magazyn_zasob_id
            WHERE zz.zlecenie_id = OLD.zlecenie_id
            AND mz.ilosc >= zz.ilosc_potrzebna
        )
        AND zlecenie_id = OLD.zlecenie_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- ================================
--    wersja dla magazyn_zasob
-- ================================

CREATE OR REPLACE FUNCTION update_magazyn_on_change_magazyn_zasob()
RETURNS TRIGGER AS $$ 
DECLARE 
    p_zlecenie_ilosc INT; 
    p_zlecenie_id INT; 
BEGIN 
    -- Obsługuje INSERT oraz UPDATE w magazyn_zasob 
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN 
        FOR p_zlecenie_id IN 
            SELECT zz.zlecenie_id
            FROM zasob_zlecenie zz
            WHERE zz.magazyn_zasob_id = NEW.magazyn_zasob_id
        LOOP 
            SELECT zz2.ilosc_potrzebna INTO p_zlecenie_ilosc 
            FROM zasob_zlecenie zz2 
            WHERE zz2.magazyn_zasob_id = NEW.magazyn_zasob_id
            AND zz2.zlecenie_id = p_zlecenie_id 
            LIMIT 1; 

            IF p_zlecenie_ilosc IS NOT NULL AND NEW.ilosc >= p_zlecenie_ilosc THEN 
                DELETE FROM zakupy_zasob zzz 
                WHERE zzz.zasob_id = NEW.zasob_id 
                AND zzz.zlecenie_id = p_zlecenie_id; 
            END IF; 
        END LOOP; 
    
    -- Obsługuje DELETE w magazyn_zasob 
    ELSIF TG_OP = 'DELETE' THEN 
        FOR p_zlecenie_id IN 
            SELECT zz.zlecenie_id 
            FROM zasob_zlecenie zz 
            WHERE zz.zasob_id = OLD.zasob_id 
        LOOP 
            SELECT zz2.ilosc_potrzebna INTO p_zlecenie_ilosc 
            FROM zasob_zlecenie zz2 
            WHERE zz2.zasob_id = OLD.zasob_id 
            AND zz2.zlecenie_id = p_zlecenie_id 
            LIMIT 1; 

            IF p_zlecenie_ilosc IS NOT NULL AND OLD.ilosc < p_zlecenie_ilosc THEN 
                INSERT INTO zakupy_zasob (zasob_id, zakupy_id, p_zlecenie_id, ilosc) 
                SELECT OLD.zasob_id, zakupy_id, p_zlecenie_id, (p_zlecenie_ilosc - OLD.ilosc) 
                FROM zakupy 
                WHERE miesiac = date_trunc('month', CURRENT_DATE) 
                ON CONFLICT (zasob_id, zakupy_id, p_zlecenie_id) 
                DO UPDATE SET ilosc = zakupy_zasob.ilosc + EXCLUDED.ilosc; 
            END IF; 
        END LOOP; 
    END IF; 

    RETURN NULL; 
END; 
$$ LANGUAGE plpgsql;


-- ================================
--      USTAWIANIE TRIGGERÓW
-- ================================

-- zasob_zlecenie
CREATE TRIGGER trigger_update_magazyn_on_change_zasob_zlecenie
AFTER INSERT OR UPDATE OR DELETE ON zasob_zlecenie
FOR EACH ROW
EXECUTE FUNCTION update_zasob_on_change_zasob_zlecenie();


-- magazyn_zasob
CREATE TRIGGER trigger_update_magazyn_on_change_magazyn_zasob
AFTER INSERT OR UPDATE OR DELETE ON magazyn_zasob
FOR EACH ROW
EXECUTE FUNCTION update_magazyn_on_change_magazyn_zasob();
