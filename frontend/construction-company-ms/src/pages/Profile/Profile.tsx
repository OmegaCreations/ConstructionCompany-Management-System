import { useEffect, useState } from "react";
import { initialUserState, UserData } from "../../utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useGetFetch from "../../hooks/FetchHooks";
import Loading from "../../components/Loading/Loading";
import Popup from "../../components/Popup/Popup";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState(initialUserState);
  const user: UserData = useSelector((state: RootState) => state.user);
  const { data, error, loading } = useGetFetch(
    "http://loacalhost:5000/api/user"
  );

  // load user data from store or fetch if needed
  useEffect(() => {
    if (user) {
      setUserData(...[user]);
    } else if (data) {
      setUserData(...[data]);
    }
  }, [user, data]);

  if (error) {
    return <Popup type="error" text="" />;
  }

  return <div>{loading ? <Loading /> : <div>{userData.imie}</div>}</div>;
};

export default Profile;
