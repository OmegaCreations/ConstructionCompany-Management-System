import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";
import { RootState } from "../store/store";

// Implements protected routes for different user roles
// if user role is correct this component will return Outlet component which returns passed child
// else it will return navigation component back to /auth page
const ProtectedRoute: React.FC = () => {
  const { isUserAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isUserAuthenticated || !(role == "manager" || role == "worker")) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
