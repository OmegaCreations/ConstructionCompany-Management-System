import { useState } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import Loading from "../Loading/Loading";
import style from "./DataTable.module.css";
import { useNavigate } from "react-router";

interface DataTableProps {
  endpoint: string;
  editEndpoint: string | null;
  addEndpoint: string | null;
  subPageURL: string | null;
}

const DataTable: React.FC<DataTableProps> = ({
  endpoint,
  editEndpoint,
  addEndpoint,
  subPageURL,
}) => {
  const { data, error, loading } = useFetchData(endpoint);
  const [editingItem, setEditingItem] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [editedData, setEditedData] = useState<Record<string, unknown>>({});

  const navigate = useNavigate();

  const handleEdit = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setEditedData(item);
  };

  const handleChange = (key: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!editEndpoint) return;
    try {
      const response = await fetch(editEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        alert("Dane zapisane!");
        setEditingItem(null);
      } else {
        alert("Wystąpił błąd.");
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania", error);
    }
  };

  if (loading) return <Loading />;
  if (error) return error;
  if (data.length === 0) return <h1>Brak</h1>;

  return (
    <div className={style.dataContainer}>
      {addEndpoint && <button className={style.addBtn}>Dodaj</button>}
      <table>
        <thead>
          <tr>
            {Object.keys(data[0] as Record<string, unknown>).map((dataKey) => (
              <th key={dataKey}>
                {dataKey.split("_")[0]} {dataKey.split("_")[1]}
              </th>
            ))}
            {editEndpoint && <th>Akcje</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((obj, index) => (
            <tr key={index}>
              {Object.values(obj).map((objData, i) => (
                <td key={i}>{objData as string}</td>
              ))}
              {editEndpoint && (
                <td className={style.actionBtns}>
                  <button
                    onClick={() => handleEdit(obj as Record<string, unknown>)}
                  >
                    Edytuj
                  </button>
                  {subPageURL && (
                    <button
                      onClick={() => {
                        const idKey = Object.keys(obj).find((key) =>
                          key.toLowerCase().includes("id")
                        );
                        const idValue = idKey ? obj[idKey] : "";
                        navigate(`${subPageURL}/${idValue}`);
                      }}
                    >
                      Więcej
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editingItem && (
        <div className={style.popup}>
          <h3>Edytuj dane</h3>
          <div className={style.inputsContainer}>
            {Object.entries(editingItem)
              .filter(([key]) => !key.toLowerCase().includes("id"))
              .map(([key]) => (
                <div key={key}>
                  <label>
                    {key.split("_")[0]} {key.split("_")[1]}
                  </label>
                  <input
                    type="text"
                    value={editedData[key] as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              ))}
          </div>
          <button onClick={handleSave}>Zapisz</button>
          <button onClick={() => setEditingItem(null)}>Anuluj</button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
