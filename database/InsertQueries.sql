-- =========================================
-- wstawianie danych do tabeli stanowisko
-- =========================================
insert into stanowisko (nazwa, opis) values 
    ('manager', 'nadzór projektowy'),
    ('pracownik budowlany', 'wykonuje prace budowlane'),
    ('elektryk', 'obsługa systemów informatycznych firmy');


-- =========================================
-- wstawianie danych do tabeli pracownik
-- =========================================
insert into pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) 
select 'Jan', 'Kowalski', '123456789', 'jan.kowalski@company.com', 'haslo111', 80.99, stanowisko_id
from stanowisko where nazwa = 'manager';

insert into pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) 
select 'Anna', 'Nowak', '123123123', 'anna.nowak@company.com', 'haslo222', 20.00, stanowisko_id
from stanowisko where nazwa = 'pracownik budowlany';

insert into pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) 
select 'Piotr', 'Nowak', '123123123', 'piotr.nowak@company.com', 'haslo333', 18.00, stanowisko_id
from stanowisko where nazwa = 'pracownik budowlany';

insert into pracownik (imie, nazwisko, telefon, email, haslo, stawka_godzinowa, stanowisko_id) 
select 'Juliusz', 'Słowacki', '123123123', 'j.slowacki@example.com', 'haslo444', 30.00, stanowisko_id
from stanowisko where nazwa = 'elektryk';


-- =========================================
-- wstawianie danych do tabeli klient
-- =========================================
insert into klient (imie, nazwisko, firma, telefon, email, adres) values
('Andrzej', 'Malinowski', 'abc sp. z o.o.', '+42999000111', 'a.malinowski@example.com', 'xcv 11 street, Edinburg, Scotland'),
('Katarzyna', 'Kowalczyk', 'xyz s.a.', '+74000111222', 'k.kowalczyk@example.com', 'ul. asd 7, Kraków, Poland');


-- =========================================
-- wstawianie danych do tabeli zlecenie
-- =========================================
insert into zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, data_zakonczenia, lokalizacja)
select klient_id, 'wykończenie domu jednorodzinnego', '2024-01-10', '2024-01-15', null, 'xcv 11 street, Edinburg, Scotland'
from klient where firma = 'abc sp. z o.o.';

insert into zlecenie (klient_id, opis, data_zlozenia, data_rozpoczecia, data_zakonczenia, lokalizacja)
select klient_id, 'remont biura', '2024-02-01', '2024-02-10', '2024-03-15', 'ul. asd 7, Kraków, Poland'
from klient where firma = 'xyz s.a.';


-- =========================================
-- wstawianie danych do tabeli dzien_pracy
-- =========================================
insert into dzien_pracy (pracownik_id, zlecenie_id, data, godzina_rozpoczecia, godzina_zakonczenia)
select pracownik_id, zlecenie_id, '2024-01-16', '08:00', null
from pracownik, zlecenie 
where pracownik.imie = 'Jan' and pracownik.nazwisko = 'Kowalski' and zlecenie.opis = 'wykończenie domu jednorodzinnego';


-- =========================================
-- wstawianie danych do tabeli sprzet
-- =========================================
insert into sprzet (nazwa, opis, koszt_jednostkowy) values
('młot pneumatyczny', 'do prac wyburzeniowych', 1500.00),
('betoniarka', 'do mieszania betonu', 2000.00),
('drabina', 'prace na wysokościach', 300.00);


-- =========================================
-- wstawianie danych do tabeli magazyn
-- =========================================
insert into magazyn (nazwa, lokalizacja) values
('magazyn centralny', 'ul. centralna 11a, Warszawa'),
('magazyn południowy', 'ul. Czarnowiejska 8, Kraków');


-- =========================================
-- wstawianie danych do tabeli magazyn_sprzet
-- =========================================
insert into magazyn_sprzet (magazyn_id, sprzet_id, ilosc)
select magazyn_id, sprzet_id, 5
from magazyn, sprzet
where magazyn.nazwa = 'magazyn centralny' and sprzet.nazwa = 'młot pneumatyczny';

insert into magazyn_sprzet (magazyn_id, sprzet_id, ilosc)
select magazyn_id, sprzet_id, 3
from magazyn, sprzet
where magazyn.nazwa = 'magazyn centralny' and sprzet.nazwa = 'betoniarka';

insert into magazyn_sprzet (magazyn_id, sprzet_id, ilosc)
select magazyn_id, sprzet_id, 10
from magazyn, sprzet
where magazyn.nazwa = 'magazyn południowy' and sprzet.nazwa = 'drabina';


-- =========================================
-- wstawianie danych do tabeli sprzet_zlecenie
-- =========================================
insert into sprzet_zlecenie (sprzet_id, zlecenie_id, ilosc_potrzebna, ilosc_zapewniona)
select sprzet_id, zlecenie_id, 2, 0
from sprzet, zlecenie
where sprzet.nazwa = 'młot pneumatyczny' and zlecenie.opis = 'wykończenie domu jednorodzinnego';

insert into sprzet_zlecenie (sprzet_id, zlecenie_id, ilosc_potrzebna, ilosc_zapewniona)
select sprzet_id, zlecenie_id, 1, 1
from sprzet, zlecenie
where sprzet.nazwa = 'betoniarka' and zlecenie.opis = 'wykończenie domu jednorodzinnego';

insert into sprzet_zlecenie (sprzet_id, zlecenie_id, ilosc_potrzebna, ilosc_zapewniona)
select sprzet_id, zlecenie_id, 5, 3
from sprzet, zlecenie
where sprzet.nazwa = 'drabina' and zlecenie.opis = 'remont biura';
