SET search_path TO construction_company;

set client_encoding to 'UTF8';

-- delete from all tables

select from truncate_schema();

-- =========================================
-- stanowisko
-- =========================================

INSERT INTO stanowisko (nazwa, opis)
VALUES
('Manager', 'Nadzór nad zespołem.'),
('Inżynier budowy', 'Projektowanie i nadzór nad budową.'),
('Technik budowlany', 'Wsparcie techniczne.'),
('Kierownik robót', 'Koordynacja i nadzorowanie prac.'),
('Operator maszyn', 'Obsługa maszyn budowlanych'),
('Specjalista ds. zaopatrzenia', 'Zaopatrzenie w materiały budowlane.'),
('Geodeta', 'Pomiary terenu i sporządzanie map.'),
('Elektromonter', 'Instalacje elektryczne'),
('Dekarz', 'Prace związane z pokryciem dachowym.');

-- =========================================
-- pracownik  - !!! hasło to: root  
-- =========================================

INSERT INTO pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id)
VALUES 
('Jan', 'Kowalski', '123456789', 'jan.kowalski@example.com',
       '$2a$10$cgFUp2aez.kE2B.qiA0bxeIc0Stx30IaojVRxiN9oqk1m60JnSc6q', 50.00,
       (SELECT stanowisko_id FROM stanowisko WHERE nazwa = 'Manager')),
('Anna', 'Nowak', '987654321', 'anna.nowak@example.com',
       '$2a$10$cgFUp2aez.kE2B.qiA0bxeIc0Stx30IaojVRxiN9oqk1m60JnSc6q', 45.00,
       (SELECT stanowisko_id FROM stanowisko WHERE nazwa = 'Elektromonter')),
('Krzysztof', 'Nowak', '666777888', 'krzysztof.nowak@example.com',
       '$2a$10$cgFUp2aez.kE2B.qiA0bxeIc0Stx30IaojVRxiN9oqk1m60JnSc6q', 45.00,
       (SELECT stanowisko_id FROM stanowisko WHERE nazwa = 'Dekarz'));

-- =========================================
-- klient
-- =========================================

INSERT INTO klient (imie, nazwisko, firma, telefon, email, adres)
VALUES
('Adam', 'Nowicki', 'OBI', '500600700', 'adam.nowicki@obi.com', 'Kraków, ul. Czarnowiejska 15'),
('Ewelina', 'Kowalczyk', 'SkyHigh', '600700800', 'ewelina.kowalczyk@skyhigh.pl', 'Warszawa, ul. Krakowiaków 3');

-- =========================================
-- zlecenie
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
SELECT p.pracownik_id, z.zlecenie_id, '2025-1-04'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Anna' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Budowa magazynu%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2025-1-05'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Anna' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2025-1-06'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Anna' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2025-1-04'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Krzysztof' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2025-1-05'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Krzysztof' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

INSERT INTO dzien_pracy (pracownik_id, zlecenie_id, data)
SELECT p.pracownik_id, z.zlecenie_id, '2025-1-06'
FROM pracownik p, zlecenie z
WHERE p.imie = 'Krzysztof' AND p.nazwisko = 'Nowak' AND z.opis LIKE '%Konstrukcja stalowej hali%';

-- =========================================
-- zasob
-- =========================================

INSERT INTO zasob (nazwa, jednostka, typ, koszt_jednostkowy, opis)
VALUES 
('Stal', 'kg', 'material', 5.0, 'Stal konstrukcyjna.'),
('Kabel', 'm', 'material', 2.5, 'Kabel miedziany o przekroju 2.5 mm^2'),
('Monitor', 'szt.', 'sprzet', 500.0, 'Monitor Full HD 24"'),
('Laptop', 'szt.', 'sprzet', 3000.0, 'Laptop lenovo Thinkpad.'),
('Drewno', 'm^3', 'material', 300.0, 'Drewno sosnowe konstrukcyjne'),
('Farba', 'l', 'material', 50.0, 'Farba akrylowa do wnętrz - śnieżka.'),
('Śruba', 'szt.', 'material', 0.1, 'Śruby M8 z gwintem.'),
('Płyta gipsowa', 'szt.', 'material', 30.0, 'Płyta gipsowa 120x240 cm'),
('Drukarka', 'szt.', 'sprzet', 800.0, 'Drukarka laserowa monochromatyczna.'),
('Router', 'szt.', 'sprzet', 250.0, 'Router WiFi Orange');

-- =========================================
-- magazyn
-- =========================================

INSERT INTO magazyn (nazwa, lokalizacja)
VALUES 
('Magazyn Kraków', 'Kraków, ul. Wysłouchów 13a'),
('Magazyn Warszawa', 'Warszawa, ul. Mokotowska 7');

-- =========================================
-- magazyn_zasob
-- =========================================

INSERT INTO magazyn_zasob (ilosc, magazyn_id, zasob_id)
VALUES
(5, 1, 1),  -- 5 kg stali w magazynie 1
(300, 1, 2),  -- 300 m kabla w magazynie 1
(50, 2, 3),   -- 50 monitorów w magazynie 2
(20, 2, 4),   -- 20 laptopów w magazynie 2
(100, 1, 5),  -- 100 m^3 drewna w magazynie 1
(40, 1, 6),   -- 40 litrów farby w magazynie 1
(1000, 1, 7), -- 1000 śrub w magazynie 1
(20, 2, 8),  -- 20 płyt gipsowych w magazynie 2
(10, 2, 9),   -- 10 drukarek w magazynie 2
(15, 2, 10), -- 15 routerów w magazynie 2
(5, 2, 1);  -- 5 kg stali w magazynie 2

-- =========================================
-- zasob_zlecenie
-- =========================================

INSERT INTO zasob_zlecenie (zasob_id, zlecenie_id, ilosc_potrzebna)
VALUES
(1, 1, 200),
(5, 1, 300),
(8, 1, 30),
(2, 2, 50),
(3, 2, 2);