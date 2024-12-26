import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import { initialWarehouseState } from "../../utils/types";
import style from "./WarehouseData.module.css";

const WarehouseData: React.FC = () => {
  return (
    <div className={style.warehousesContainer}>
      <h1>Twoje Magazyny i zasoby</h1>
      <h3>
        Poniżej możesz zobaczyć listę magazynów Twojej firmy. Możesz edytować
        ich dane, ich zasoby lub dodawać nowe informacje.
      </h3>
      <DataTable
        endpoint={endpoint.WAREHOUSE_GET_ALL()}
        editEndpoint={"TODO"}
        addEndpoint={"TODO"}
        subPageURL={"/warehouse/data/details"}
        initialObjectState={(({ magazyn_id, ...o }) => o)(
          initialWarehouseState
        )}
      />
    </div>
  );
};

export default WarehouseData;
