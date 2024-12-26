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
          editEndpoint={"TODO"}
          addEndpoint={"TODO"}
          subPageURL={""}
          initialObjectState={(({ zasob_id, ...o }) => o)(initialResourceState)}
        />
      </div>
    </div>
  );
};

export default WarehouseDetails;
