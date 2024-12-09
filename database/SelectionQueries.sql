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