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
INSERT INTO stanowisko (stanowisko_id, nazwa, opis)
VALUES
(1, 'Inżynier', 'Zarządzanie projektami technicznymi'),
(2, 'Technik', 'Wsparcie techniczne przy realizacji zleceń'),
(3, 'Kierownik', 'Nadzór nad zespołem pracowników'),
(4, 'Logistyk', 'Planowanie dostaw i zasobów'),
(5, 'Administrator', 'Obsługa systemów informatycznych'),
(6, 'Serwisant', 'Naprawa urządzeń i maszyn'),
(7, 'Specjalista ds. sprzedaży', 'Kontakt z klientami i oferta sprzedaży'),
(8, 'Magazynier', 'Obsługa magazynu i zasobów'),
(9, 'Asystent', 'Wsparcie administracyjne'),
(10, 'Elektromechanik', 'Instalacja i konserwacja sprzętu elektrycznego');


-- =========================================
-- Tabela: pracownik
-- =========================================
INSERT INTO pracownik (pracownik_id, imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id)
VALUES
(1, 'Jan', 'Kowalski', '123456789', 'jan.kowalski@example.com', 'haslo', 50.00, 1),
(2, 'Anna', 'Nowak', '987654321', 'anna.nowak@example.com', 'haslo', 45.00, 2),
(3, 'Piotr', 'Zieliński', '564738291', 'piotr.zielinski@example.com', 'haslo', 55.00, 3),
(4, 'Maria', 'Wiśniewska', '748392615', 'maria.wisniewska@example.com', 'haslo', 48.00, 4),
(5, 'Krzysztof', 'Krawczyk', '123789456', 'krzysztof.krawczyk@example.com', 'haslo', 60.00, 5),
(6, 'Agnieszka', 'Dąbrowska', '321654987', 'agnieszka.dabrowska@example.com', 'haslo', 52.00, 6),
(7, 'Paweł', 'Wójcik', '456789123', 'pawel.wojcik@example.com', 'haslo', 49.00, 7),
(8, 'Zofia', 'Kamińska', '654321789', 'zofia.kaminska@example.com', 'haslo', 47.00, 8),
(9, 'Tomasz', 'Lewandowski', '987123654', 'tomasz.lewandowski@example.com', 'haslo', 50.00, 9),
(10, 'Ewa', 'Szymańska', '789654123', 'ewa.szymanska@example.com', 'haslo', 53.00, 10);

-- =========================================
-- Tabela: klient
-- =========================================
INSERT INTO klient (klient_id, imie, nazwisko, firma, telefon, email, adres)
VALUES
(1, 'Adam', 'Nowicki', 'TechSoft', '500600700', 'adam.nowicki@techsoft.com', 'Kraków, ul. Prosta 10'),
(2, 'Ewelina', 'Kowalczyk', 'BuildIt', '600700800', 'ewelina.kowalczyk@buildit.pl', 'Warszawa, ul. Główna 20'),
(3, 'Marek', 'Maj', 'ElectroFix', '700800900', 'marek.maj@electrofix.com', 'Wrocław, ul. Krótka 5'),
(4, 'Joanna', 'Laskowska', 'GreenEnergy', '800900100', 'joanna.laskowska@greenenergy.com', 'Poznań, ul. Długa 15'),
(5, 'Wojciech', 'Adamski', 'SteelWorks', '900100200', 'wojciech.adamski@steelworks.com', 'Łódź, ul. Szeroka 8'),
(6, 'Sylwia', 'Sobczak', 'SmartSystems', '100200300', 'sylwia.sobczak@smartsystems.com', 'Gdańsk, ul. Wąska 12'),
(7, 'Patryk', 'Górski', 'SkyTech', '200300400', 'patryk.gorski@skytech.com', 'Szczecin, ul. Zielona 7'),
(8, 'Andrzej', 'Abacki', 'QuickFix', '300400500', 'andrzej.a@quickfix.com', 'Kraków, ul. Czarnowiejska 7'),
(9, 'Monika', 'Lis', 'QuickFix', '300400501', 'batlomiej.lis@quickfix.com', 'Kraków, ul. Czarnowiejska 7a'),
(10, 'Czarek', 'Cabacki', 'QuickFix', '300400502', 'czarek.cabacki@quickfix.com', 'Kraków, ul. Czarnowiejska 7b');


-- =========================================
-- Tabela: zlecenie
-- =========================================
INSERT INTO zlecenie (zlecenie_id, klient_id, opis, data_zlozenia, data_rozpoczecia, data_zakonczenia, lokalizacja)
VALUES 
(1, 1, 'Instalacja sprzętu IT', '2024-12-01', '2024-12-02', '2024-12-05', 'Kraków'),
(2, 2, 'Naprawa maszyn przemysłowych', '2024-12-03', '2024-12-04', '2024-12-10', 'Warszawa'),
(3, 3, 'Projektowanie wnętrz biurowych', '2024-12-05', '2024-12-06', '2024-12-12', 'Łódź'),
(4, 4, 'Budowa hali produkcyjnej', '2024-12-07', '2024-12-08', '2024-12-20', 'Wrocław'),
(5, 5, 'Automatyzacja linii produkcyjnej', '2024-12-09', '2024-12-10', '2024-12-15', 'Gdańsk'),
(6, 6, 'Serwis maszyn CNC', '2024-12-11', '2024-12-12', '2024-12-18', 'Poznań'),
(7, 7, 'Montaż systemów bezpieczeństwa', '2024-12-13', '2024-12-14', '2024-12-16', 'Katowice'),
(8, 8, 'Modernizacja sieci elektrycznej', '2024-12-15', '2024-12-16', '2024-12-22', 'Rzeszów'),
(9, 9, 'Renowacja budynku', '2024-12-17', '2024-12-18', '2024-12-25', 'Opole'),
(10, 10, 'Transport specjalistyczny', '2024-12-19', '2024-12-20', '2024-12-22', 'Lublin');

-- =========================================
-- Tabela: dzien_pracy
-- =========================================
INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
VALUES 
(1, 1, '2024-12-02'),
(1, 2, '2024-12-03'),
(1, 3, '2024-12-07'),
(2, 2, '2024-12-04'),
(3, 3, '2024-12-06'),
(4, 4, '2024-12-11'),
(5, 5, '2024-12-10'),
(6, 6, '2024-12-12'),
(7, 7, '2024-12-14'),
(8, 8, '2024-12-16'),
(9, 9, '2024-12-18'),
(10, 10, '2024-12-20');

-- =========================================
-- Tabela: zasob
-- =========================================
INSERT INTO zasob (zasob_id, nazwa, jednostka, typ, koszt_jednostkowy, opis)
VALUES 
(1, 'Stal', 'kg', 'material', 5.0, 'Wysokiej jakości stal konstrukcyjna'),
(2, 'Kabel', 'm', 'material', 2.5, 'Kabel miedziany o przekroju 2.5 mm^2'),
(3, 'Monitor', 'szt.', 'sprzet', 500.0, 'Monitor Full HD 24"'),
(4, 'Laptop', 'szt.', 'sprzet', 3000.0, 'Laptop z procesorem i5 i 8GB RAM'),
(5, 'Drewno', 'm^3', 'material', 300.0, 'Drewno sosnowe konstrukcyjne'),
(6, 'Farba', 'l', 'material', 50.0, 'Farba akrylowa do wnętrz'),
(7, 'Śruba', 'szt.', 'material', 0.1, 'Śruby M8 z gwintem'),
(8, 'Płyta gipsowa', 'szt.', 'material', 30.0, 'Płyta gipsowa 120x240 cm'),
(9, 'Drukarka', 'szt.', 'sprzet', 800.0, 'Drukarka laserowa monochromatyczna'),
(10, 'Router', 'szt.', 'sprzet', 250.0, 'Router WiFi 6');

-- =========================================
-- Tabela: magazyn
-- =========================================
INSERT INTO magazyn (magazyn_id, nazwa, lokalizacja)
VALUES 
(1, 'Magazyn Kraków', 'Kraków, ul. Wysłouchów 13a'),
(2, 'Magazyn Warszawa', 'Warszawa, ul. Mokotowska 7');

-- =========================================
-- Tabela: magazyn_zasob
-- =========================================
INSERT INTO magazyn_zasob (magazyn_zasob_id, ilosc, magazyn_id, zasob_id)
VALUES
(1, 500, 1, 1),  -- 500 kg stali w magazynie 1
(2, 300, 1, 2),  -- 300 m kabla w magazynie 1
(3, 50, 2, 3),   -- 50 monitorów w magazynie 2
(4, 20, 2, 4),   -- 20 laptopów w magazynie 2
(5, 100, 1, 5),  -- 100 m³ drewna w magazynie 1
(6, 40, 1, 6),   -- 40 litrów farby w magazynie 1
(7, 1000, 1, 7), -- 1000 śrub w magazynie 1
(8, 200, 2, 8),  -- 200 płyt gipsowych w magazynie 2
(9, 10, 2, 9),   -- 10 drukarek w magazynie 2
(10, 15, 2, 10); -- 15 routerów w magazynie 2


-- =========================================
-- Tabela: magazyn_zasob
-- =========================================
INSERT INTO zasob_zlecenie (magazyn_zasob_id, zlecenie_id, ilosc_potrzebna)
VALUES
(1, 1, 20),   -- 20 kg stali użyte do instalacji sprzętu IT
(2, 2, 50),   -- 50 m kabla użyte do naprawy maszyn przemysłowych
(3, 3, 2),    -- 2 monitory dostarczone do projektu wnętrz
(4, 4, 1),    -- 1 laptop do budowy hali produkcyjnej
(5, 5, 10),   -- 10 m³ drewna do automatyzacji linii produkcyjnej
(6, 6, 5),    -- 5 litrów farby użytej w serwisie maszyn CNC
(7, 7, 200),  -- 200 śrub do montażu systemów bezpieczeństwa
(8, 8, 10),   -- 10 płyt gipsowych do modernizacji sieci elektrycznej
(9, 9, 1),    -- 1 drukarka do renowacji budynku
(10, 10, 2);  -- 2 routery do transportu specjalistycznego

-- PONIZEJ SA FUNKCJE KTORE BEDA DODAWAC ODPOWIEDNIE OBIEKTY