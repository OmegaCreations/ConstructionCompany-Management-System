import { UserData } from "../../utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useGetFetch from "../../hooks/useGetFetch";
import Loading from "../../components/Loading/Loading";
import Popup from "../../components/Popup/Popup";
import { endpoint } from "../../utils/endpoints";

const Profile: React.FC = () => {
  const user: UserData = useSelector((state: RootState) => state.user);
  const { error, loading } = useGetFetch(endpoint.USER_GET);

  if (error) {
    return <Popup type="error" text="" />;
  }

  return <div>{loading ? <Loading /> : <div>{user.imie}</div>}</div>;
};

export default Profile;
