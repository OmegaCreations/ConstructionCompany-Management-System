// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useRef } from "react";
import DataTable from "../../components/DataTable/DataTable";
import { useFetchData } from "../../hooks/useFetchData";
import { endpoint } from "../../utils/endpoints";
import { initialShoppingListState } from "../../utils/types";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

import style from "@/ManagerDashboard.module.css";

const ManagerDashboard: React.FC = () => {
  const { user_id } = useSelector((state: RootState) => state.auth);
  const { data: profitsData } = useFetchData(endpoint.PROFITS());
  const { data: workHoursData } = useFetchData(
    endpoint.WORKDAT_GET_TOTAL_HOURS()
  );
  const { data: workday } = useFetchData(
    endpoint.WORKDAY_GET_BY_DATE(
      user_id,
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    )
  );

  // drawing canvases
  const canvasRef = useRef(null);
  const wydatki = profitsData.wydatki ? Number(profitsData.wydatki) : 0;
  const zyski = profitsData.zyski ? Number(profitsData.zyski) : 0;

  // wymaganie projektowe grafik canvsaowych
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const total = zyski + wydatki;
    const zyskiAngle = (zyski / total) * 2 * Math.PI;
    const wydatkiAngle = (wydatki / total) * 2 * Math.PI;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // draw profits
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, zyskiAngle);
    ctx.closePath();
    ctx.fillStyle = "#4caf50";
    ctx.fill();

    // draw looses
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, zyskiAngle, zyskiAngle + wydatkiAngle);
    ctx.closePath();
    ctx.fillStyle = "#f44336";
    ctx.fill();

    // draw legend
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`Zyski: ${zyski} PLN`, 20, canvas.height - 50);
    ctx.fillText(`Wydatki: ${wydatki} PLN`, 20, canvas.height - 30);
  }, [zyski, wydatki]);

  return (
    <div className={style.dashboardContainer}>
      <section className={``}>
        <h3>Lista zakupów na ten miesiąc</h3>
        <DataTable
          endpoint={endpoint.SHOPPING_LIST_GET(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
          )}
          subPageURL={""}
          editEndpoint={""}
          addEndpoint={""}
          deleteEndpoint={""}
          editOptionalObjects={[]}
          additionalBody={{}}
          initialObjectState={initialShoppingListState}
        />
      </section>
      <section className={``}>
        <h3>Oszacowane przyszłe zyski/wydatki z aktualnych zleceń</h3>
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          style={{ height: 300, width: 300 }}
        />
      </section>
      <section className={``}>
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
      <section className={``}>
        <h3>Przepracowane godziny w tym miesiącu</h3>
        <h3>{Math.floor(Number(workHoursData.total_hours))}</h3>
      </section>
    </div>
  );
};

export default ManagerDashboard;
