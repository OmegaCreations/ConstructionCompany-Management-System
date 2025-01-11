import { useParams } from "react-router";
import { useFetchData } from "../../../hooks/useFetchData";
import { endpoint } from "../../../utils/endpoints";
import style from "./ClientDetails.module.css";
import Loading from "../../../components/Loading/Loading";
import { ClientData, initialOrderState } from "../../../utils/types";
import DataTable from "../../../components/DataTable/DataTable";

const ClientDetails: React.FC = () => {
  const { id } = useParams();
  const { data, error, loading } = useFetchData(
    endpoint.CLIENT_GET(Number(id))
  );

  const client: ClientData = data as unknown as ClientData;

  if (loading) return <Loading />;
  if (error) return error;
  if (data.length === 0) return "No data.";

  return (
    <div className={style.clientContainer}>
      <div className={style.clientData}>
        <h1>
          {client.imie} {client.nazwisko}
        </h1>
        <h2>{client.firma}</h2>
        <span>
          <strong>TELEFON: </strong>
          {client.telefon}
        </span>
        <span>
          <strong>EMAIL: </strong>
          {client.email}
        </span>
        <span>
          <strong>ADRES: </strong>
          {client.adres}
        </span>
      </div>
      <div className={style.clientOrders}>
        <h1>Zlecenia</h1>
        <DataTable
          endpoint={endpoint.ORDER_CLIENT_GET(Number(id))}
          editEndpoint={endpoint.ORDER_UPDATE()}
          deleteEndpoint={endpoint.ORDER_DELTE()}
          addEndpoint={endpoint.ORDER_CREATE()}
          subPageURL={"/orders/details"}
          editOptionalObjects={[]}
          additionalBody={{ klient_id: Number(id) }}
          initialObjectState={(({
            zlecenie_id,
            klient_id,
            klient_imie,
            klient_nazwisko,
            klient_firma,
            ...o
          }) => o)(initialOrderState)}
        />
      </div>
    </div>
  );
};

export default ClientDetails;
