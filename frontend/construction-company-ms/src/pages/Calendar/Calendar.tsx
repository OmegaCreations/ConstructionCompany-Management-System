import { useState, useEffect } from "react";
import style from "./Calendar.module.css";
import { endpoint } from "../../utils/endpoints";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useFetchData } from "../../hooks/useFetchData";
import Loading from "../../components/Loading/Loading";
import {
  InitialWorkDayState,
  OrderData,
  UserData,
  WorkDay,
} from "../../utils/types";
import { refreshAccessToken } from "../../utils/refreshToken";
import { logout, setAccessToken } from "../../store/slices/authSlice";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const [employeeComment, setEmployeeComment] = useState("");
  const [managerComment, setManagerComment] = useState("");

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const dispatch = useDispatch();

  const { user_id, role, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [chosenUserID, setChosenUserID] = useState(user_id);

  const { data: monthWorkdayData, loading } = useFetchData(
    endpoint.WORKDAY_GET_BY_MONTH(chosenUserID, currentYear, currentMonth + 1)
  );

  const {
    data,
    loading: loadingDay,
    reloadDataComponent,
  } = useFetchData(
    endpoint.WORKDAY_GET_BY_DATE(
      chosenUserID,
      activeDate.getFullYear(),
      activeDate.getMonth() + 1,
      activeDate.getDate()
    )
  );
  const [workdayData, setWorkdayData] = useState(data as unknown as WorkDay);

  // update work hours
  const [startHour, setStartHour] = useState(workdayData.godzina_rozpoczecia);
  const [endHour, setEndHour] = useState(workdayData.godzina_zakonczenia);

  useEffect(() => {
    console.log(data);
    setWorkdayData(data as unknown as WorkDay);
    setStartHour(data.godzina_rozpoczecia);
    setEndHour(data.godzina_zakonczenia);
    setEmployeeComment(data.opis_pracownika);
    setManagerComment(data.opis_managera);
  }, [data]);

  // =======================================================================
  //                      NEW WORKDAYS' DATA
  // =======================================================================
  const [postResponseData, setPostResponseData] = useState<object>({}); // for POST fetching
  const [addingWorkdays, setAddingWorkdays] = useState(false);
  const [workdays, setWorkdays] = useState([]);
  const [newWorkday, setNewWorkday] = useState({
    zlecenie_id: 1,
    data: "",
    opis_managera: "",
    pracownik_id: chosenUserID,
  });

  const { data: ordersFetchedData } = useFetchData(
    role === "manager" ? endpoint.ORDER_GET_ALL() : ""
  );
  const ordersData: OrderData[] = ordersFetchedData as unknown as OrderData[];

  // =======================================================================
  //                      FETCHING DAY'S DATA
  // =======================================================================

  const { data: userFetchedData } = useFetchData(endpoint.USER_GET_ALL());
  const userData: UserData[] = userFetchedData as unknown as UserData[];

  // =======================================================================
  //                      HANDLE CALENDAR DATES
  // =======================================================================
  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const datesArray: Date[] = [];

    // Poprzedni miesiąc
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      datesArray.push(new Date(currentYear, currentMonth, -i));
    }

    // Bieżący miesiąc
    for (let i = 1; i <= daysInMonth; i++) {
      datesArray.push(new Date(currentYear, currentMonth, i));
    }

    // Następny miesiąc
    for (let i = 1; i < 7 - lastDayIndex; i++) {
      datesArray.push(new Date(currentYear, currentMonth + 1, i));
    }

    setDates(datesArray);
  }, [currentYear, currentMonth]);

  const handleDateClick = (date: Date) => {
    setActiveDate(date);
    reloadDataComponent();
    if (date.getMonth() !== currentMonth) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const setPrevDate = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const setNextDate = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const renderDates = () => {
    return dates.map((date, index) => {
      const isToday = date.toDateString() === new Date().toDateString();
      const isActive = date.toDateString() === activeDate.toDateString();
      const isCurrentMonth = date.getMonth() === currentMonth;
      const hasWork = monthWorkdayData?.some((work: any) => {
        const workDate = new Date(work.data);
        return (
          workDate.getFullYear() === date.getFullYear() &&
          workDate.getMonth() === date.getMonth() &&
          workDate.getDate() === date.getDate()
        );
      });

      return (
        <div
          key={index}
          className={`${style.date} ${isToday ? style.active : ""} ${
            isActive ? style.selected : ""
          } ${isCurrentMonth ? "" : style.inactive} ${
            hasWork ? style.workday : ""
          }`}
          onClick={() => handleDateClick(date)}
        >
          {date.getDate()}
        </div>
      );
    });
  };

  // ==================================================================
  //                        NEW WORKDAYS
  // ==================================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      setNewWorkday((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // adding new workday to list
  const handleAddWorkday = () => {
    if (newWorkday.zlecenie_id && newWorkday.data) {
      setWorkdays([...workdays, newWorkday]);
      setNewWorkday({
        zlecenie_id: 1,
        data: "",
        opis_managera: "",
        pracownik_id: chosenUserID,
      });
    } else {
      alert("Wprowadź zlecenie i datę.");
    }
  };

  // ==================================================================
  //                    API CONNECTION
  // ==================================================================
  // refresh access token if needed
  const refreshToken = async () => {
    const newToken = await refreshAccessToken();
    if (newToken.token === "") {
      dispatch(logout());
      return false;
    } else {
      localStorage.setItem("accessToken", newToken.token);
      dispatch(setAccessToken(newToken.token));
      return true;
    }
  };

  const handleSubmitWorkdays = () => {
    fetch(endpoint.WORKDAY_ADD(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workdays),
    })
      .then(async (res) => {
        if (res.status === 401) {
          await refreshToken();
        }
        return res.json();
      })
      .then((responseData) => {
        setAddingWorkdays(false);
        setWorkdays([]);
        setPostResponseData(responseData);
      })
      .catch((err) => setPostResponseData(err));
  };

  const handleUpdate = () => {
    let payload: WorkDay = InitialWorkDayState;

    if (role === "worker") {
      payload.opis_pracownika = employeeComment;
      payload.pracownik_id = chosenUserID;
      payload.zlecenie_id = workdayData.zlecenie_id;
      payload.data = workdayData.data;
      payload.godzina_rozpoczecia = startHour;
      payload.godzina_zakonczenia = endHour;
    } else if (role === "manager") {
      payload = { ...payload, ...workdayData };
      payload.opis_managera = managerComment;
      payload.godzina_rozpoczecia = startHour;
      payload.godzina_zakonczenia = endHour;
      payload.pracownik_id = chosenUserID;
    }

    // Sending payload to endpoint
    fetch(endpoint.WORKDAY_UPDATE(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.status === 401) {
          await refreshToken();
        }
        return res.json();
      })
      .then((responseData) => {
        setPostResponseData(responseData);
      })
      .catch((err) => setPostResponseData(err));
  };

  const handleDelete = async () => {
    fetch(endpoint.WORKDAY_DELETE(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pracownik_id: workdayData.pracownik_id,
        zlecenie_id: workdayData.zlecenie_id,
        data: workdayData.data,
      }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          await refreshToken();
        }
        return res.json();
      })
      .then((responseData) => {
        setPostResponseData(responseData);
      })
      .catch((err) => setPostResponseData(err));
  };

  // ==================================================================
  //                       SINGLE WORKDAYS
  // ==================================================================
  const workdayRender = () => {
    return (
      <>
        {Object.keys(workdayData).length === 0 ? (
          <h2>Dzień wolny, brak pracy</h2>
        ) : (
          <div className={style.inputs}>
            <h3>
              {workdayData.pracownik_imie} {workdayData.pracownik_nazwisko}
            </h3>
            <span>
              <strong>Lokalizacja: </strong>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${(
                  workdayData as unknown as WorkDay
                ).zlecenie_lokalizacja
                  .split(" ")
                  .join("+")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {workdayData.zlecenie_lokalizacja}
              </a>
            </span>
            <span>
              <strong>Zleceniodawca:</strong>
              {workdayData.klient_imie} {workdayData.klient_nazwisko} -{" "}
              {workdayData.klient_firma}
            </span>
            <p>
              <strong>Opis zleceniodawcy:</strong>
              {(workdayData as unknown as WorkDay).zlecenie_opis}
            </p>
            <div>
              <label>Godzina rozpoczęcia:</label>
              <input
                type="time"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
              />
            </div>
            <div>
              <label>Godzina zakończenia:</label>
              <input
                type="time"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
              />
            </div>
            <div>
              <label>
                {role === "worker" ? "Twój komentarz" : "Komentarz pracownika"}
              </label>
              <textarea
                value={employeeComment}
                onChange={(e) => setEmployeeComment(e.target.value)}
                readOnly={role === "manager"}
              ></textarea>
            </div>
            <div>
              <label>Komentarz od menedżera</label>
              <textarea
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                readOnly={role === "worker"}
              ></textarea>
            </div>
            <button onClick={handleUpdate}>Zapisz</button>
            {role === "manager" && <button onClick={handleDelete}>Usuń</button>}
          </div>
        )}
      </>
    );
  };

  // ==================================================================
  //                          POPUP
  // ==================================================================
  const popup = () => {
    return (
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

  // ==================================================================
  //                          MAIN RENDER
  // ==================================================================
  return (
    <div className={style.calendarContainer}>
      {loading ? (
        <Loading />
      ) : (
        <section className={style.calendarSection}>
          <div className={style.calendarHeader}>
            <button onClick={setPrevDate}>
              <svg
                style={{ marginLeft: "10px" }}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </button>
            {role === "manager" && (
              <>
                <select
                  onChange={(e) => {
                    setChosenUserID(Number(e.target.value));
                  }}
                  defaultValue={chosenUserID}
                >
                  {userData.map((user: UserData) => (
                    <option key={user.pracownik_id} value={user.pracownik_id}>
                      {user.imie} {user.nazwisko}
                    </option>
                  ))}
                </select>
                <button
                  className={style.addBtn}
                  onClick={() => setAddingWorkdays(true)}
                >
                  Dodaj dzień pracy
                </button>
              </>
            )}
            <div className={style.monthYearDisplay}>
              {currentDate.toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button onClick={setNextDate}>
              <svg
                style={{ transform: "rotate(180deg)", marginRight: "10px" }}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </button>
          </div>
          <div className={style.days}>
            {["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"].map((day) => (
              <div key={day} className={style.day}>
                {day}
              </div>
            ))}
          </div>
          <div className={style.dates}>{renderDates()}</div>
        </section>
      )}
      <aside className={style.workInfo}>
        <h1>
          {activeDate.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
          })}
        </h1>
        {loadingDay ? <Loading /> : workdayRender()}
      </aside>

      {addingWorkdays && role === "manager" && (
        <div className={style.popup}>
          <h3>
            Dodaj nowe dni pracy dla {userData[chosenUserID - 1].imie}{" "}
            {userData[chosenUserID - 1].nazwisko}
          </h3>

          {workdays.map((day, index) => (
            <div key={index}>
              <p>Zlecenie: {day.zlecenie_id}</p>
              <p>Data: {day.data}</p>
              <p>Opis: {day.opis_managera || "Brak"}</p>
            </div>
          ))}

          <div className={style.formContainer}>
            <select
              onChange={handleInputChange}
              value={newWorkday.zlecenie_id}
              name="zlecenie_id"
            >
              {ordersData.map((order) => (
                <option key={order.zlecenie_id} value={order.zlecenie_id}>
                  {order.klient_firma} {order.klient_imie}{" "}
                  {order.klient_nazwisko} - {order.opis.slice(0, 40)}...
                </option>
              ))}
            </select>
            <input
              type="date"
              name="data"
              value={newWorkday.data}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="opis_managera"
              placeholder="Opis (opcjonalnie)"
              value={newWorkday.opis_managera}
              onChange={handleInputChange}
            />
            <button onClick={handleAddWorkday}>Dodaj dzień</button>
          </div>

          <button onClick={handleSubmitWorkdays}>Zapisz</button>
          <button onClick={() => setAddingWorkdays(false)}>Anuluj</button>
        </div>
      )}

      {Object.keys(postResponseData).length !== 0 && popup()}
    </div>
  );
};

export default Calendar;
