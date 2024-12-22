import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import style from "./Clients.module.css";

const Clients: React.FC = () => {
  return (
    <div className={style.clientsContainer}>
      <h1>Klienci</h1>
      <h3>
        Poniżej możesz zobaczyć listę klientów Twojej firmy. Możesz edytować ich
        dane lub przejść do ich stron, aby zobaczyć dane podsumowujące.
      </h3>
      <DataTable
        endpoint={endpoint.CLIENT_GET_ALL()}
        editEndpoint={"TODO"}
        addEndpoint={"TODO"}
        doSubpageDetails={true}
      />
    </div>
  );
};

export default Clients;
