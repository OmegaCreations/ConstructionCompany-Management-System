import DataTable from "../../components/DataTable/DataTable";
import { endpoint } from "../../utils/endpoints";
import style from "./Resources.module.css";

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
        editEndpoint={"TODO"}
        addEndpoint={"TODO"}
      />
    </div>
  );
};

export default Resources;
