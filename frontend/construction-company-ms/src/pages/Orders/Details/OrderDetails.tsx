import { useParams } from "react-router";
import { useFetchData } from "../../../hooks/useFetchData";
import { endpoint } from "../../../utils/endpoints";
import style from "@/OrderDetails.module.css";
import {
  initialOrderResourceState,
  OrderCosts,
  OrderData,
} from "../../../utils/types";
import Loading from "../../../components/Loading/Loading";
import DataTable from "../../../components/DataTable/DataTable";

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const {
    data: orderData,
    error,
    loading,
  } = useFetchData(endpoint.ORDER_GET(Number(id)));
  const order: OrderData = orderData as unknown as OrderData;

  const {
    data: costsData,
    error: costsError,
    loading: costsLoading,
  } = useFetchData(endpoint.ORDER_GET_COSTS(Number(id)));
  const orderCosts: OrderCosts = costsData as unknown as OrderCosts;

  if (error || costsError) return error;

  return (
    <div className={style.orderContainer}>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.orderData}>
          <h1>
            {order.klient_imie} {order.klient_nazwisko}
          </h1>
          <span>
            <strong>Firma</strong> {order.klient_firma}
          </span>
          <span>{order.lokalizacja}</span>

          <span>
            <strong>Data złożenia: </strong>
            {order.data_zlozenia
              ? new Date(order.data_zlozenia).toLocaleDateString("pl-PL")
              : "Brak"}
          </span>
          <span>
            <strong>Data rozpoczęcia: </strong>
            {order.data_zakonczenia
              ? new Date(order.data_rozpoczecia).toLocaleDateString("pl-PL")
              : "Brak"}
          </span>
          <span>
            <strong>Data zakończenia: </strong>
            {order.data_zakonczenia
              ? new Date(order.data_zakonczenia).toLocaleDateString("pl-PL")
              : "Brak"}
          </span>
          <h1>Opis zlecenia</h1>
          <p>{order.opis}</p>
        </div>
      )}
      <div className={style.orderCosts}>
        {costsLoading ? (
          <Loading />
        ) : (
          <>
            <span>
              <strong>Koszty pracownicze: </strong>
              {orderCosts.koszty_pracownikow}
            </span>
            <span>
              <strong>Liczba przypisanych pracowników: </strong>
              {orderCosts.liczba_pracownikow}
            </span>
            <span>
              <strong>Suma przepracowanych godzin: </strong>
              {orderCosts.przepracowane_godziny}
            </span>
            <span>
              <strong>Koszty dodatkowych zasobów: </strong>
              {orderCosts.koszty_zasobow}PLN
            </span>
          </>
        )}
      </div>
      <div className={style.orderResources}>
        <h1>Wymagane zasoby dla zlecenia</h1>
        <DataTable
          endpoint={endpoint.ORDER_GET_RESOURCES(Number(id))}
          editEndpoint={endpoint.ORDER_UPDATE_RESOURCE()}
          addEndpoint={endpoint.ORDER_ADD_RESOURCE()}
          subPageURL={""}
          deleteEndpoint={endpoint.ORDER_DELETE_RESOURCE()}
          additionalBody={{ zlecenie_id: id }}
          editOptionalObjects={[
            {
              field_name: ["nazwa"],
              endpoint: endpoint.RESOURCE_GET_ALL(),
              data_id_name: "zasob_id",
              data_name: "nazwa",
            },
          ]}
          initialObjectState={(({
            zasob_id,
            jednostka,
            opis,
            koszt_jednostkowy,
            typ,
            ...o
          }) => o)(initialOrderResourceState)}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
