import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import { initialClientState } from "../../utils/types";
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
        addEndpoint={endpoint.CLIENT_CREATE()}
        subPageURL={"/clients/details"}
        initialObjectState={(({ klient_id, ...o }) => o)(initialClientState)}
        editOptionalObjects={[]}
      />
    </div>
  );
};

export default Clients;
