import { useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import Loading from "../Loading/Loading";
import style from "./DataTable.module.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface EditOptionalObject {
  field_name: string;
  endpoint: string;
  data_id_name: string;
  data_name: string;
}

interface DataTableProps {
  endpoint: string;
  editEndpoint: string | null;
  addEndpoint: string | null;
  subPageURL: string | null;
  editOptionalObjects?: EditOptionalObject[];
}

const DataTable: React.FC<DataTableProps> = ({
  endpoint,
  editEndpoint,
  addEndpoint,
  subPageURL = null,
  editOptionalObjects = [],
}) => {
  const { data, error, loading } = useFetchData(endpoint);
  const [editingItem, setEditingItem] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [editedData, setEditedData] = useState<Record<string, unknown>>({});
  const [dropdownData, setDropdownData] = useState<Record<string, unknown[]>>(
    {}
  );
  const { token } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const fetchDropdownData = async () => {
    const promises = editOptionalObjects.map(async (obj) => {
      const response = await fetch(obj.endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return { [obj.field_name]: result };
    });
    const results = await Promise.all(promises);
    const dataMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    console.log(
      dataMap[editOptionalObjects[0].field_name].map(
        (item) => item[editOptionalObjects[0].data_id_name]
      )
    );
    setDropdownData(dataMap);
  };

  useEffect(() => {
    fetchDropdownData();
  }, [editOptionalObjects]);

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
              <th key={dataKey}>{dataKey.split("_").join(" ")}</th>
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
                  <label>{key.split("_").join(" ")}</label>
                  {dropdownData[key] ? (
                    <select
                      value={editedData[key] as string}
                      onChange={(e) => handleChange(key, e.target.value)}
                    >
                      {dropdownData[key].map((item) => (
                        <option
                          key={
                            item[
                              editOptionalObjects.find(
                                (obj) => obj.field_name === key
                              )?.data_id_name
                            ]
                          }
                          value={
                            item[
                              editOptionalObjects.find(
                                (obj) => obj.field_name === key
                              )?.data_name
                            ]
                          }
                        >
                          {
                            item[
                              editOptionalObjects.find(
                                (obj) => obj.field_name === key
                              )?.data_name
                            ]
                          }
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editedData[key] as string}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  )}
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
