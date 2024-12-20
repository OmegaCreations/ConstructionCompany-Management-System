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
