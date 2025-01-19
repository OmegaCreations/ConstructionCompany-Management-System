import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import { initialOrderState } from "../../utils/types";
import style from "@/Orders.module.css";

const Orders: React.FC = () => {
  return (
    <div className={style.ordersContainer}>
      <h1>Zlecenia</h1>
      <h3>
        Poniżej możesz zobaczyć listę zleceń klientów Twojej firmy. Możesz
        edytować ich dane lub przejść do ich stron, aby zobaczyć dane
        podsumowujące.
      </h3>
      <DataTable
        endpoint={endpoint.ORDER_GET_ALL()}
        editEndpoint={endpoint.ORDER_UPDATE()}
        deleteEndpoint={endpoint.ORDER_DELTE()}
        addEndpoint={endpoint.ORDER_CREATE()}
        subPageURL={"/orders/details"}
        editOptionalObjects={[
          {
            field_name: ["klient_firma", "imie", "nazwisko"],
            endpoint: endpoint.CLIENT_GET_ALL(),
            data_id_name: "klient_id",
            data_name: "firma",
          },
        ]}
        additionalBody={{}}
        initialObjectState={(({
          zlecenie_id,
          klient_id,
          klient_imie,
          klient_nazwisko,
          ...o
        }) => o)(initialOrderState)}
      />
    </div>
  );
};

export default Orders;
