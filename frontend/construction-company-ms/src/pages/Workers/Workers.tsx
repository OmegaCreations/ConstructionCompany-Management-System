import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import style from "./Workers.module.css";

const Workers: React.FC = () => {
  return (
    <div className={style.workersContainer}>
      <h1>Pracownicy</h1>
      <h3>
        Poniżej możesz zobaczyć listę klientów Twojej firmy. Możesz edytować ich
        dane lub przejść do ich stron, aby zobaczyć dane podsumowujące.
      </h3>
      <DataTable
        endpoint={endpoint.USER_GET_ALL()}
        editEndpoint={"TODO"}
        addEndpoint={"TODO"}
        subPageURL={""}
        editOptionalObjects={[
          {
            field_name: "stanowisko_nazwa",
            endpoint: endpoint.POSITION_GET_ALL(),
            data_id_name: "stanowisko_id",
            data_name: "nazwa",
          },
        ]}
      />
    </div>
  );
};

export default Workers;
