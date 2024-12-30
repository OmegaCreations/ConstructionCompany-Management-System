import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import { initialShoppingListState } from "../../utils/types";

const ManagerDashboard: React.FC = () => {
  return (
    <div>
      <h1>Hello manager dashboard!</h1>
      <div>
        <h3>Lista zakupów na ten miesiąc</h3>
        <DataTable
          endpoint={endpoint.SHOPPING_LIST_GET(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
          )}
          subPageURL={""}
          editEndpoint={""}
          addEndpoint={""}
          editOptionalObjects={[]}
          additionalBody={{}}
          initialObjectState={initialShoppingListState}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
