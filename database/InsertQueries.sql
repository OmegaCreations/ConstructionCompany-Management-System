SET search_path TO construction_company;
set client_encoding to 'UTF8';

-- czyszczenie wszystkich tablic w schemacie construction_company.
DO $$
DECLARE
    tabela TEXT;
BEGIN
    FOR tabela IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'construction_company'
    LOOP
        EXECUTE format('TRUNCATE TABLE %I.%I RESTART IDENTITY CASCADE;', 'construction_company', tabela);
    END LOOP;
END $$;


-- PONIZEJ SA PRZYKLADOWE DANE KTORE BEDA UZYWANE PRZY RESECIE BAZY

-- =========================================
-- Tabela: stanowisko
-- =========================================
INSERT INTO stanowisko (nazwa, opis)
VALUES
('Manager', 'Nadzór nad zespołem i planowanie strategiczne'),
('Inżynier budowy', 'Projektowanie i nadzór nad budową'),
('Technik budowlany', 'Wsparcie techniczne na placu budowy'),
('Kierownik robót', 'Koordynacja i nadzorowanie prac budowlanych'),
('Operator maszyn', 'Obsługa maszyn budowlanych'),
('Specjalista ds. zaopatrzenia', 'Zaopatrzenie w materiały budowlane'),
('Geodeta', 'Pomiary terenu i sporządzanie map'),
('Elektromonter', 'Instalacje elektryczne na budowie'),
('Murator', 'Murowanie ścian i budynków'),
('Dekarz', 'Prace związane z pokryciem dachowym');


-- =========================================
-- Tabela: pracownik  - !!! hasło to: root  
-- =========================================
INSERT INTO pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id)
SELECT 'Jan', 'Kowalski', '123456789', 'jan.kowalski@example.com',
       '$2a$10$cgFUp2aez.kE2B.qiA0bxeIc0Stx30IaojVRxiN9oqk1m60JnSc6q', 50.00,
       stanowisko_id FROM stanowisko WHERE nazwa = 'Manager';

INSERT INTO pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id)
SELECT 'Anna', 'Nowak', '987654321', 'anna.nowak@example.com',
       '$2a$10$cgFUp2aez.kE2B.qiA0bxeIc0Stx30IaojVRxiN9oqk1m60JnSc6q', 45.00,
       stanowisko_id FROM stanowisko WHERE nazwa = 'Technik Budowlany';

INSERT INTO pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id)
SELECT 'Krzysztof', 'Nowak', '666777888', 'krzysztof.nowak@example.com',
       '$2a$10$cgFUp2aez.kE2B.qiA0bxeIc0Stx30IaojVRxiN9oqk1m60JnSc6q', 45.00,
       stanowisko_id FROM stanowisko WHERE nazwa = 'Dekarz';


-- =========================================
-- Tabela: klient
-- =========================================
INSERT INTO klient (imie, nazwisko, firma, telefon, email, adres)
VALUES
('Adam', 'Nowicki', 'BuildMasters', '500600700', 'adam.nowicki@buildmasters.com', 'Kraków, ul. Budowlana 15'),
('Ewelina', 'Kowalczyk', 'SkyHigh Constructions', '600700800', 'ewelina.kowalczyk@skyhigh.pl', 'Warszawa, ul. Wieżowa 3');


-- =========================================
-- Tabela: zlecenie
-- =========================================
INSERT INTO zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, lokalizacja)
SELECT klient_id, 'Budowa magazynu o powierzchni 1000m2 wraz z pełną infrastrukturą. Wymagana instalacja elektryczna, hydrauliczna i prace wykończeniowe.', '2024-12-01', '2024-12-05', 'Kraków, ul. Przemysłowa 8'
FROM klient WHERE imie = 'Adam' AND nazwisko = 'Nowicki';

INSERT INTO zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, lokalizacja)
SELECT klient_id, 'Konstrukcja stalowej hali produkcyjnej o wymiarach 50x30m. Wymagane prace ziemne, montaż konstrukcji oraz instalacja systemu wentylacyjnego.', '2024-12-03', '2024-12-07', 'Warszawa, ul. Fabryczna 20'
FROM klient WHERE imie = 'Ewelina' AND nazwisko = 'Kowalczyk';

-- =========================================
-- Tabela: dzien_pracy
-- =========================================
INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2024-12-04'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Anna' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Budowa magazynu%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2024-12-05'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Anna' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2024-12-06'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Anna' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';


INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2024-12-04'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Krzysztof' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2024-12-05'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Krzysztof' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2024-12-06'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Krzysztof' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';



-- =========================================
-- Tabela: zasob
-- =========================================
INSERT INTO zasob (nazwa, jednostka, typ, koszt_jednostkowy, opis)
VALUES 
('Stal', 'kg', 'material', 5.0, 'Wysokiej jakości stal konstrukcyjna'),
('Kabel', 'm', 'material', 2.5, 'Kabel miedziany o przekroju 2.5 mm^2'),
('Monitor', 'szt.', 'sprzet', 500.0, 'Monitor Full HD 24"'),
('Laptop', 'szt.', 'sprzet', 3000.0, 'Laptop z procesorem i5 i 8GB RAM'),
('Drewno', 'm^3', 'material', 300.0, 'Drewno sosnowe konstrukcyjne'),
('Farba', 'l', 'material', 50.0, 'Farba akrylowa do wnętrz'),
('Śruba', 'szt.', 'material', 0.1, 'Śruby M8 z gwintem'),
('Płyta gipsowa', 'szt.', 'material', 30.0, 'Płyta gipsowa 120x240 cm'),
('Drukarka', 'szt.', 'sprzet', 800.0, 'Drukarka laserowa monochromatyczna'),
('Router', 'szt.', 'sprzet', 250.0, 'Router WiFi 6');

-- =========================================
-- Tabela: magazyn
-- =========================================
INSERT INTO magazyn (nazwa, lokalizacja)
VALUES 
('Magazyn Kraków', 'Kraków, ul. Wysłouchów 13a'),
('Magazyn Warszawa', 'Warszawa, ul. Mokotowska 7');

-- =========================================
-- Tabela: magazyn_zasob
-- =========================================
INSERT INTO magazyn_zasob (ilosc, magazyn_id, zasob_id)
VALUES
(5, 1, 1),  -- 5 kg stali w magazynie 1
(300, 1, 2),  -- 300 m kabla w magazynie 1
(50, 2, 3),   -- 50 monitorów w magazynie 2
(20, 2, 4),   -- 20 laptopów w magazynie 2
(100, 1, 5),  -- 100 m³ drewna w magazynie 1
(40, 1, 6),   -- 40 litrów farby w magazynie 1
(1000, 1, 7), -- 1000 śrub w magazynie 1
(20, 2, 8),  -- 20 płyt gipsowych w magazynie 2
(10, 2, 9),   -- 10 drukarek w magazynie 2
(15, 2, 10), -- 15 routerów w magazynie 2
(5, 2, 1);  -- 5 kg stali w magazynie 2


-- =========================================
-- Tabela: zasob_zlecenie
-- =========================================
INSERT INTO zasob_zlecenie (zasob_id, zlecenie_id, ilosc_potrzebna)
VALUES
(1, 1, 200),   -- 20 kg stali użyte do instalacji sprzętu IT
(5, 1, 300),
(8, 1, 30),
(2, 2, 50),   -- 50 m kabla użyte do naprawy maszyn przemysłowych
(3, 2, 2);    -- 2 monitory dostarczone do projektu wnętrz


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
    INSERT INTO zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, lokalizacja, data_zakonczenia)
    VALUES (p_klient_id, p_opis, p_data_zlozenia, p_data_rozpoczecia, p_lokalizacja, p_data_zakonczenia);
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
    DO UPDATE SET ilosc_potrzebna = zasob_zlecenie.ilosc_potrzebna + EXCLUDED.ilosc_potrzebna;
END;
$$ LANGUAGE plpgsql;







-- inne ważne inserty:
INSERT INTO pracownik 
        (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *; -- dodawanie nowego pracownika

