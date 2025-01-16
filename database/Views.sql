-- widok zasobów w magazynie dla pracowników (nie pokazujemy kosztów jednostkowych)
CREATE OR REPLACE VIEW view_zasoby_magazynu_pracownik AS
SELECT 
    mz.magazyn_id,
    m.nazwa AS nazwa_magazynu,
    z.zasob_id,
    z.nazwa AS nazwa_zasobu,
    z.jednostka,
    z.typ,
    mz.ilosc,
    z.opis
FROM magazyn_zasob mz
JOIN magazyn m ON mz.magazyn_id = m.magazyn_id
JOIN zasob z ON mz.zasob_id = z.zasob_id;

-- widok klienta (widok jest wymagany więc po prostu nie pokazuje id zleceń):
CREATE OR REPLACE VIEW client_view AS
SELECT 
    k.klient_id,
    k.imie,
    k.nazwisko,
    k.firma,
    k.telefon,
    k.email,
    k.adres,
    z.opis,
    z.wycena,
    to_char(z.data_zlozenia, 'YYYY-MM-DD') AS data_zlozenia,
    to_char(z.data_rozpoczecia, 'YYYY-MM-DD') AS data_rozpoczecia,
    to_char(z.data_zakonczenia, 'YYYY-MM-DD') AS data_zakonczenia,
    z.lokalizacja
FROM klient k
JOIN zlecenie z ON k.klient_id = z.klient_id;


-- permisje
GRANT SELECT ON view_zasoby_magazynu_pracownik TO construction_company_admin_role;
GRANT SELECT ON client_view TO construction_company_admin_role;