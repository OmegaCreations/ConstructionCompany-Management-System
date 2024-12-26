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
  editEndpoint: string;
  addEndpoint: string;
  subPageURL: string | null;
  editOptionalObjects?: EditOptionalObject[];
  initialObjectState: object;
}

const DataTable: React.FC<DataTableProps> = ({
  endpoint,
  editEndpoint,
  addEndpoint,
  subPageURL = null,
  editOptionalObjects = [],
  initialObjectState,
}) => {
  // getting data
  const { data, error, loading } = useFetchData(endpoint);

  // editing data
  const [editingItem, setEditingItem] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [editedData, setEditedData] = useState<Record<string, unknown>>({});
  const [dropdownData, setDropdownData] = useState<Record<string, unknown[]>>(
    {}
  );

  // POST actions
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const [newData, setNewData] = useState<Record<string, unknown>>({});
  const [postResponseData, setPostResponseData] = useState<object>({});
  const [postLoading, setPostLoading] = useState<boolean>(false);

  // other
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // fetching info about <select> options
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
    setDropdownData(dataMap);
  };

  useEffect(() => {
    fetchDropdownData();
  }, [editOptionalObjects]);

  // POSTing new data
  const handleAdd = () => {
    fetch(addEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        return res.json();
      })
      .then((responseData) => {
        console.log(responseData);
        setPostResponseData(responseData);
        setPostLoading(false);
      })
      .catch((err) => setPostResponseData(err));
  };

  const handleEdit = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setEditedData(item);
  };

  const handleChangeEdit = (key: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangeCreate = (key: string, value: string) => {
    setNewData((prev) => ({
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

  const popup = () => {
    return postLoading ? (
      <Loading />
    ) : (
      <div className={style.popup}>
        {Object.entries(postResponseData).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value.toString()}
          </div>
        ))}
        <button onClick={() => setPostResponseData({})}>Zamknij</button>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return error;
  if (data.length === 0) return <h1>Brak</h1>;

  const renderSelect = (key: string) => {
    const options = dropdownData[key] || [];
    const optionalObj = editOptionalObjects.find(
      (obj) => obj.field_name === key
    );

    return (
      <select
        value={editedData[key] as string}
        onChange={(e) => {
          handleChangeEdit(optionalObj?.data_id_name, e.target.value);
          handleChangeCreate(optionalObj?.data_id_name, e.target.value);
        }}
      >
        <option value="">Wybierz...</option>
        {options.map((item) => (
          <option
            key={item[optionalObj?.data_id_name]}
            value={item[optionalObj?.data_id_name]}
          >
            {item[optionalObj?.data_name]}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={style.dataContainer}>
      {addEndpoint && (
        <button className={style.addBtn} onClick={() => setAddingItem(true)}>
          Dodaj
        </button>
      )}
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
                    renderSelect(key)
                  ) : (
                    <input
                      type="text"
                      value={editedData[key] as string}
                      onChange={(e) => handleChangeEdit(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
          </div>
          <button onClick={handleSave}>Zapisz</button>
          <button onClick={() => setEditingItem(null)}>Anuluj</button>
        </div>
      )}

      {addingItem && (
        <div className={style.popup}>
          <h3>Dodaj nowy element</h3>
          <div className={style.inputsContainer}>
            {Object.entries(initialObjectState).map(([key, value]) => (
              <div key={key}>
                <label>{key.split("_").join(" ")}</label>
                {dropdownData[key] ? (
                  renderSelect(key)
                ) : (
                  <input
                    type="text"
                    value={newData[key] as string}
                    onChange={(e) => handleChangeCreate(key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <button onClick={handleAdd}>Dodaj</button>
          <button onClick={() => setAddingItem(false)}>Anuluj</button>
        </div>
      )}

      {Object.keys(postResponseData).length !== 0 && popup()}
    </div>
  );
};

export default DataTable;
