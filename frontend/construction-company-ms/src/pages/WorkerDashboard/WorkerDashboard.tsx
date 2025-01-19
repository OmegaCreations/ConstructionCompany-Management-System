// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { endpoint } from "../../utils/endpoints";
import { useFetchData } from "../../hooks/useFetchData";
import { useParams } from "react-router";
import style from "./WorkerDashboard.module.css";

// we want it to be publicly visible for managers but worker can only access his own page
const WorkerDashboard: React.FC = () => {
  const { id } = useParams();
  const { user_id, role } = useSelector((state: RootState) => state.auth);

  const _id =
    Number(id) !== Number(user_id) && role === "manager"
      ? Number(id)
      : Number(user_id);

  const { data: userData } = useFetchData(endpoint.USER_GET(_id));
  const { data: workHoursData } = useFetchData(
    endpoint.WORKDAT_GET_TOTAL_HOURS()
  );
  const { data: workday } = useFetchData(
    endpoint.WORKDAY_GET_BY_DATE(
      _id,
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    )
  );

  return (
    <div className={style.dashboardContainer}>
      <section>
        <h1>
          {userData.imie} {userData.nazwisko}
        </h1>
      </section>
      <section>
        <h1>Dzisiejsza praca {new Date().toLocaleDateString("pl-PL")}</h1>
        {Object.keys(workday).length === 0 ? (
          <h2>Dzisiaj masz wolne!</h2>
        ) : (
          <>
            <h2>{workday.zlecenie_lokalizacja}</h2>
            <p>{workday.zlecenie_opis}</p>
            <p>{workday.opis_managera}</p>
          </>
        )}
      </section>
      <section>
        <h3>Przepracowane godziny w tym miesiącu</h3>
        <h2>
          {Math.floor(
            Number(!workHoursData.total_hours ? 0 : workHoursData.total_hours)
          )}
        </h2>
      </section>
    </div>
  );
};

export default WorkerDashboard;
