import { useState, useEffect } from "react";
import style from "./Calendar.module.css";
import { endpoint } from "../../utils/endpoints";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useFetchData } from "../../hooks/useFetchData";
import Loading from "../../components/Loading/Loading";
import { UserData, WorkDay } from "../../utils/types";

const Calendar: React.FC = () => {
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [employeeComment, setEmployeeComment] = useState("");
  const [managerComment, setManagerComment] = useState(
    "Przykładowy komentarz menedżera"
  );

  const [monthYear, setMonthYear] = useState("");
  const [Dates, setDates] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { user_id, role } = useSelector((state: RootState) => state.auth);
  const [chosenUserID, setChosenUserID] = useState(user_id);

  const [apiUrl, setApiUrl] = useState("");
  const [monthApiUrl, setMonthApiUrl] = useState("");

  // fetching data
  const { data: workdayData, error, loading } = useFetchData(apiUrl);
  const { data: monthWorkdayData } = useFetchData(monthApiUrl);
  const { data: userFetchedData } = useFetchData(endpoint.USER_GET_ALL());
  const userData: UserData[] = userFetchedData as unknown as UserData[];

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

  const handleSave = () => {};
  return (
    <div className={style.calendarContainer}>
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
                  {(workdayData as unknown as WorkDay).pracownik_imie}{" "}
                  {(workdayData as unknown as WorkDay).pracownik_nazwisko}
                </h3>
                <span>
                  <strong>Lokalizacja: </strong>
                  <a>
                    {(workdayData as unknown as WorkDay).zlecenie_lokalizacja}
                  </a>
                </span>
                <span>
                  <strong>Zleceniodawca:</strong>
                  {(workdayData as unknown as WorkDay).klient_imie}{" "}
                  {(workdayData as unknown as WorkDay).klient_nazwisko} -
                  {(workdayData as unknown as WorkDay).klient_firma}
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
                      !(workdayData as unknown as WorkDay).godzina_rozpoczecia
                        ? "12:00"
                        : (workdayData as unknown as WorkDay)
                            .godzina_rozpoczecia
                    }
                    onChange={(e) => setStartHour(e.target.value)}
                  />
                </div>
                <div>
                  <label>Godzina zakończenia:</label>
                  <input
                    type="time"
                    value={
                      !(workdayData as unknown as WorkDay).godzina_zakonczenia
                        ? "12:00"
                        : (workdayData as unknown as WorkDay)
                            .godzina_zakonczenia
                    }
                    onChange={(e) => setEndHour(e.target.value)}
                  />
                </div>
                <div>
                  <label>Twój komentarz</label>
                  <textarea
                    value={employeeComment}
                    onChange={(e) => setEmployeeComment(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label>Komentarz od menedżera</label>
                  <textarea value={managerComment} readOnly></textarea>
                </div>
                <button onClick={handleSave}>Zapisz</button>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
};

export default Calendar;
