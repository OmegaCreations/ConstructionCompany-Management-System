import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import style from "./Orders.module.css";

const Orders: React.FC = () => {
  return (
    <div className={style.ordersContainer}>
      <h1>Pracownicy</h1>
      <h3>
        Poniżej możesz zobaczyć listę klientów Twojej firmy. Możesz edytować ich
        dane lub przejść do ich stron, aby zobaczyć dane podsumowujące.
      </h3>
      <DataTable
        endpoint={endpoint.ORDER_GET_ALL()}
        editEndpoint={"TODO"}
        addEndpoint={"TODO"}
      />
    </div>
  );
};

export default Orders;
