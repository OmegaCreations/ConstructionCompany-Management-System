import { useSelector } from "react-redux";
import WorkerDashboard from "../WorkerDashboard/WorkerDashboard";
import { RootState } from "../../store/store";
import ManagerDashboard from "../ManagerDashboard/ManagerDashboard";
import { Navigate } from "react-router";

// returns dashboard for user's role
const Dashboard = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role === "worker") {
    return <WorkerDashboard />;
  }
  if (role === "manager") {
    return <ManagerDashboard />;
  }
  return <Navigate to="/auth" />;
};

export default Dashboard;
