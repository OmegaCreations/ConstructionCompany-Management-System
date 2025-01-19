// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import Loading from "../Loading/Loading";
import style from "@/DataTable.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logout, setAccessToken } from "../../store/slices/authSlice";
import { refreshAccessToken } from "../../utils/refreshToken";

interface EditOptionalObject {
  field_name: string[];
  endpoint: string;
  data_id_name: string;
  data_name: string;
}

interface DataTableProps {
  endpoint: string;
  editEndpoint: string;
  addEndpoint: string;
  deleteEndpoint: string;
  subPageURL: string | null;
  editOptionalObjects?: EditOptionalObject[];
  initialObjectState: object;
  additionalBody: object;
}

const DataTable: React.FC<DataTableProps> = ({
  endpoint,
  editEndpoint,
  addEndpoint,
  deleteEndpoint,
  subPageURL = null,
  editOptionalObjects = [],
  initialObjectState,
  additionalBody = {},
}) => {
  // getting data
  const { data, error, loading, reloadDataComponent } = useFetchData(endpoint);

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
  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const newToken = await refreshAccessToken();
      if (!newToken || newToken.token === "") {
        dispatch(logout());
        return false;
      }

      localStorage.setItem("accessToken", newToken.token);
      dispatch(setAccessToken(newToken.token));
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch(logout());
      return false;
    }
  };

  // fetching info about <select> options
  const fetchDropdownData = async () => {
    const promises = editOptionalObjects.map(async (obj) => {
      let response = await fetch(obj.endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        const success = await refreshToken();

        if (success) {
          response = await fetch(obj.endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ensure new token is used
            },
          });
        } else {
          return null; // exit if token refresh fails
        }
      }

      if (!response.ok) {
        console.error("Failed to fetch data for:", obj.field_name[0]);
        return null; // skip if response isn't successful
      }

      const result = await response.json();
      // DEBUG: console.log("res: ", result);
      return { [obj.field_name[0]]: result };
    });

    const results = await Promise.all(promises);

    const filteredResults = results.filter((result) => result !== null);

    const dataMap = filteredResults.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    setDropdownData(dataMap);
  };

  useEffect(() => {
    fetchDropdownData();
  }, [editOptionalObjects]);

  // POSTing new data
  const handleAdd = async (
    retry = true,
    f_token = localStorage.getItem("accessToken")
  ) => {
    try {
      setPostLoading(true);
      const res = await fetch(addEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${f_token}`,
        },
        body: JSON.stringify({ ...newData, ...additionalBody }),
      });

      if (res.status === 500) {
        const errorData = await res.json();
        setPostResponseData(errorData);
        return null;
      }

      if (res.status === 401 && retry) {
        const success = await refreshToken();
        if (success) {
          return handleAdd(false); // retry once, no infinite loop
        } else {
          dispatch(logout());
          return null;
        }
      }

      if (res.ok) {
        const responseData = await res.json();
        // DEBUG: console.log(responseData);
        setPostResponseData(responseData);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add data");
      }
    } catch (err) {
      console.error("Error: ", err);
      setPostResponseData(err);
    } finally {
      setPostLoading(false);
      reloadDataComponent();
    }
  };

  // handle DELETE request
  const handleDelete = async (
    retry = true,
    item: Record<string, unknown>,
    f_token = localStorage.getItem("accessToken")
  ) => {
    const confirmDelete = confirm("Czy na pewno usunąć?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${f_token}`,
        },
        body: JSON.stringify({ ...item, ...additionalBody }),
      });

      if (res.status === 500) {
        const errorData = await res.json();
        setPostResponseData(errorData);
        return null;
      }

      if (res.status === 401 && retry) {
        const success = await refreshToken();
        if (success) {
          return handleDelete(false, item); // retry once
        } else {
          dispatch(logout());
          return null;
        }
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.message || `Failed to delete. Status: ${res.status}`
        );
      }

      const responseData = await res.json();
      setPostResponseData(responseData);
    } catch (err) {
      setPostResponseData(err);
    } finally {
      reloadDataComponent();
    }
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

  // handles saving updated object
  const handleSave = async (
    retry = true,
    f_token = localStorage.getItem("accessToken")
  ) => {
    const confirmUpdate = confirm("Czy na pewno zapisać?");
    if (!confirmUpdate) return;

    try {
      const res = await fetch(editEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${f_token}`,
        },
        body: JSON.stringify({ ...editedData, ...additionalBody }),
      });

      if (res.status === 500) {
        const errorData = await res.json();
        setPostResponseData(errorData);
        return null;
      }

      if (res.status === 401 && retry) {
        const success = await refreshToken();
        if (success) {
          return handleSave(false); // retry once
        } else {
          dispatch(logout());
          return null;
        }
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.message || `Failed to update. Status: ${res.status}`
        );
      }

      const responseData = await res.json();
      setPostResponseData(responseData);
    } catch (err) {
      setPostResponseData(err);
    } finally {
      reloadDataComponent();
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

  const renderSelect = (key: string) => {
    const options = dropdownData[key] || [];
    const optionalObj = editOptionalObjects.find((obj) =>
      obj.field_name.includes(key)
    );

    return (
      <select
        value={editedData[key] as string}
        onChange={(e) => {
          handleChangeEdit(optionalObj?.data_id_name, e.target.value);
          handleChangeCreate(optionalObj?.data_id_name, e.target.value);
          setEditedData((prev) => ({
            ...prev,
            [key]: e.target.value,
          }));
        }}
      >
        <option value="">Wybierz...</option>
        {options.map((item) => (
          <option
            key={item[optionalObj?.data_id_name]}
            value={item[optionalObj?.data_id_name]}
          >
            {item[optionalObj?.data_name]}{" "}
            {optionalObj?.field_name.map((field, idx) => {
              if (idx === 0) return;
              return `${item[field]} `;
            })}
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
      {data.length === 0 ? (
        <h1>Brak</h1>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0] as Record<string, unknown>).map(
                (dataKey) => (
                  <th key={dataKey}>{dataKey.split("_").join(" ")}</th>
                )
              )}
              {editEndpoint && <th>Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((obj, index) => (
              <tr key={`row-${index}`}>
                {Object.entries(obj).map(([key, objData]) => (
                  <td key={`cell-${index}-${key}`}>
                    {/data|date/i.test(key) && typeof objData === "string"
                      ? new Date(objData).toLocaleDateString("pl-PL")
                      : (objData as string)}
                  </td>
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
                    {deleteEndpoint && (
                      <button
                        onClick={() =>
                          handleDelete(true, obj as Record<string, unknown>)
                        }
                      >
                        Usuń
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingItem && (
        <div className={style.popup}>
          <h3>Edytuj dane</h3>
          <div className={style.inputsContainer}>
            {Object.entries(editingItem)
              .filter(([key]) => key in initialObjectState)
              .map(([key]) => (
                <div key={key}>
                  <label>{key.split("_").join(" ")}</label>
                  {dropdownData[key] ? (
                    renderSelect(key)
                  ) : (
                    <input
                      type={/data|date/i.test(key) ? "date" : "text"}
                      value={editedData[key] as string}
                      onChange={(e) => handleChangeEdit(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
          </div>
          <button onClick={() => handleSave(true)}>Zapisz</button>
          <button onClick={() => setEditingItem(null)}>Anuluj</button>
        </div>
      )}

      {addingItem && (
        <div className={style.popup}>
          <h3>Dodaj nowy element</h3>
          <div className={style.inputsContainer}>
            {Object.entries(initialObjectState).map(([key]) => (
              <div key={key}>
                <label>{key.split("_").join(" ")}</label>
                {dropdownData[key] ? (
                  renderSelect(key)
                ) : (
                  <input
                    type={/data|date/i.test(key) ? "date" : "text"}
                    value={newData[key] as string}
                    onChange={(e) => handleChangeCreate(key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <button onClick={handleAdd} disabled={postLoading}>
            {postLoading ? <Loading /> : "Dodaj"}
          </button>
          <button onClick={() => setAddingItem(false)}>Anuluj</button>
        </div>
      )}

      {Object.keys(postResponseData).length !== 0 && popup()}
    </div>
  );
};

export default DataTable;
