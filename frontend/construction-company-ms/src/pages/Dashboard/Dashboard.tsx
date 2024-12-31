import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ManagerDashboard from "../ManagerDashboard/ManagerDashboard";
import { Navigate } from "react-router";

// returns dashboard for user's role
const Dashboard = () => {
  const { role, user_id } = useSelector((state: RootState) => state.auth);

  if (role === "worker") {
    return <Navigate to={`/dashboard/${user_id}`} />;
  }
  if (role === "manager") {
    return <ManagerDashboard />;
  }

  return <Navigate to="/auth" />;
};

export default Dashboard;
