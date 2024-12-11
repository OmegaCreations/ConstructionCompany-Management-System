import { useState } from "react";
import { initialUserState } from "../../utils/types";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState(initialUserState);

  return <>Profil</>;
};

export default Profile;
