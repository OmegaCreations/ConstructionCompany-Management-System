import { useState, useEffect } from "react";
import style from "./Calendar.module.css";
import { endpoint } from "../../utils/endpoints";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useFetchData } from "../../hooks/useFetchData";
import Loading from "../../components/Loading/Loading";
import { OrderData, UserData, WorkDay } from "../../utils/types";
import { refreshAccessToken } from "../../utils/refreshToken";
import { logout, setAccessToken } from "../../store/slices/authSlice";

const Calendar: React.FC = () => {
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");

  const [monthYear, setMonthYear] = useState("");
  const [Dates, setDates] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const dispatch = useDispatch();

  const { user_id, role, token } = useSelector(
    (state: RootState) => state.auth
  );
  const [chosenUserID, setChosenUserID] = useState(user_id);

  const [apiUrl, setApiUrl] = useState("");
  const [monthApiUrl, setMonthApiUrl] = useState("");

  // new workdays data
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

  // fetching data
  const { data, loading } = useFetchData(apiUrl);
  const workdayData: WorkDay = data as unknown as WorkDay;
  const [employeeComment, setEmployeeComment] = useState("");
  const [managerComment, setManagerComment] = useState("");

  const { data: monthWorkdayData } = useFetchData(monthApiUrl);
  const { data: userFetchedData } = useFetchData(endpoint.USER_GET_ALL());
  const userData: UserData[] = userFetchedData as unknown as UserData[];

  useEffect(() => {
    if (data) {
      setEmployeeComment(workdayData.opis_pracownika || "");
      setManagerComment(workdayData.opis_managera || "");
    }
  }, [data]);

  useEffect(() => {
    const newUrl = endpoint.WORKDAY_GET_BY_DATE(
      chosenUserID,
      activeDate.getFullYear(),
      activeDate.getMonth() + 1,
      activeDate.getDate()
    );
    setApiUrl(newUrl);
  }, [activeDate, chosenUserID]);

  useEffect(() => {
    const newMonthUrl = endpoint.WORKDAY_GET_BY_MONTH(
      chosenUserID,
      currentYear,
      currentMonth
    );
    setMonthApiUrl(newMonthUrl);
  }, [currentDate, chosenUserID]);

  const updateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    setMonthYear(
      currentDate.toLocaleDateString("default", {
        month: "long",
        year: "numeric",
      })
    );

    let datesNewContent: string = "";

    const hasWorkOnDate = (date: Date) => {
      return monthWorkdayData?.some((work: any) => {
        const workDate = new Date(work.data);
        return (
          workDate.getFullYear() === date.getFullYear() &&
          workDate.getMonth() === date.getMonth() &&
          workDate.getDate() === date.getDate()
        );
      });
    };

    for (let i = firstDayIndex; i > 0; --i) {
      const prevDate = new Date(currentYear, currentMonth - 1, 0 - i + 1);
      datesNewContent += `<div class='${style.date} ${
        style.inactive
      }' data-date='${prevDate}'>${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; ++i) {
      const date = new Date(currentYear, currentMonth - 1, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasWork = hasWorkOnDate(date);
      datesNewContent += `<div class='${style.date} ${
        isToday ? style.active : ""
      } ${
        date.toDateString() === activeDate.toDateString() ? style.selected : ""
      } ${hasWork ? style.workday : ""}' data-date='${date}'>${i}</div>`;
    }

    for (let i = 1; i <= 7 - lastDayIndex - 1; ++i) {
      const nextDate = new Date(currentYear, currentMonth, i);
      datesNewContent += `<div class='${style.date} ${
        style.inactive
      }' data-date='${nextDate}'>${nextDate.getDate()}</div>`;
    }

    setDates(datesNewContent);
  };

  const handleDateClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLDivElement;
    const selectedDate = new Date(target.getAttribute("data-date")!);

    if (selectedDate.getMonth() !== currentMonth - 1) {
      setCurrentDate(selectedDate);
    }
    setActiveDate(selectedDate);
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

  useEffect(() => {
    updateCalendar();
  }, [currentDate, activeDate, monthWorkdayData]);

  useEffect(() => {
    const dateElements = document.querySelectorAll(`.${style.date}`);
    dateElements.forEach((el) => {
      el.addEventListener("click", handleDateClick);
    });
    return () => {
      dateElements.forEach((el) => {
        el.removeEventListener("click", handleDateClick);
      });
    };
  }, [Dates]);

  function handleSave(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  // adding new workdays functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      setNewWorkday((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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
                    <option value={user.pracownik_id}>
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
            <div className={style.monthYearDisplay}>{monthYear}</div>
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
          <div
            className={style.dates}
            dangerouslySetInnerHTML={{ __html: Dates }}
          ></div>
        </section>
      )}
      <aside className={style.workInfo}>
        <h1>
          {activeDate.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
          })}
        </h1>
        {loading ? (
          <Loading />
        ) : (
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
                  >
                    {workdayData.zlecenie_lokalizacja}
                  </a>
                </span>
                <span>
                  <strong>Zleceniodawca:</strong>
                  {workdayData.klient_imie} {workdayData.klient_nazwisko} -
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
                    value={
                      !workdayData.godzina_rozpoczecia
                        ? "12:00"
                        : workdayData.godzina_rozpoczecia
                    }
                    onChange={(e) => setStartHour(e.target.value)}
                  />
                </div>
                <div>
                  <label>Godzina zakończenia:</label>
                  <input
                    type="time"
                    value={
                      !workdayData.godzina_zakonczenia
                        ? "12:00"
                        : workdayData.godzina_zakonczenia
                    }
                    onChange={(e) => setEndHour(e.target.value)}
                  />
                </div>
                <div>
                  <label>
                    {role === "worker"
                      ? "Twój komentarz"
                      : "Komentarz pracownika"}
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
                <button onClick={handleSave}>Zapisz</button>
              </div>
            )}
          </>
        )}
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
