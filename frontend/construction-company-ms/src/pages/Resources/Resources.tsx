import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import { initialResourceState } from "../../utils/types";
import style from "@/Resources.module.css";

const Resources: React.FC = () => {
  return (
    <div className={style.resourcesContainer}>
      <h1>Twoje zasoby</h1>
      <h3>
        Poniżej możesz zobaczyć listę zasobów, które możesz dodawać do
        magazynów. Edytuj, dodawaj, usuwaj, aby mieć później do nich dostęp w
        zakładce "Zasoby dostępne".
      </h3>
      <DataTable
        endpoint={endpoint.RESOURCE_GET_ALL()}
        editEndpoint={endpoint.RESOURCE_UPDATE()}
        deleteEndpoint={endpoint.RESOURCE_DELETE()}
        subPageURL={""}
        addEndpoint={endpoint.RESOURCE_CREATE()}
        editOptionalObjects={[]}
        additionalBody={{}}
        initialObjectState={(({ zasob_id, ...o }) => o)(initialResourceState)}
      />
    </div>
  );
};

export default Resources;
