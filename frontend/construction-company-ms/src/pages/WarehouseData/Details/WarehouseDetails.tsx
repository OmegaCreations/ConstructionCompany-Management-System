import { useParams } from "react-router";
import { useFetchData } from "../../../hooks/useFetchData";
import { endpoint } from "../../../utils/endpoints";
import style from "./WarehouseDetails.module.css";
import Loading from "../../../components/Loading/Loading";
import DataTable from "../../../components/DataTable/DataTable";
import { initialResourceState, Warehouse } from "../../../utils/types";

const WarehouseDetails: React.FC = () => {
  const { id } = useParams();

  const { data, error, loading } = useFetchData(endpoint.WAREHOUSE_GET_ALL());
  const warehouseData = data
    ? (data[Number(id) - 1] as unknown as Warehouse)
    : undefined;

  if (!warehouseData) {
    return <div>Nie znaleziono magazynu o podanym ID</div>;
  }

  if (error) return error;
  return (
    <div className={style.orderContainer}>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.orderData}>
          <h1>{warehouseData.nazwa}</h1>
          <span>
            <strong>Lokalizacja</strong>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${warehouseData.lokalizacja
                .split(" ")
                .join("+")}`}
              target="_blank"
            >
              {warehouseData.lokalizacja}
            </a>
          </span>
        </div>
      )}
      <div className={style.orderResources}>
        <h1>Zasoby magazynu</h1>
        <DataTable
          endpoint={endpoint.WAREHOUSE_GET_RESOURCES(Number(id))}
          editEndpoint={endpoint.WAREHOUSE_UPDATE_RESOURCE()}
          deleteEndpoint={endpoint.WAREHOUSE_DELETE_RESOURCE()}
          addEndpoint={endpoint.WAREHOUSE_ADD_RESOURCE()}
          subPageURL={""}
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
          }) => o)(initialResourceState)}
          additionalBody={{ magazyn_id: id }}
        />
      </div>
    </div>
  );
};

export default WarehouseDetails;
