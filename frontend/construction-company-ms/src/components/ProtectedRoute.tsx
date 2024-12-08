import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  allowedRoles: ("manager" | "worker")[];
}

// Implements protected routes for different user roles
// if user role is correct this component will return Outlet component which returns passed child
// else it will return navigation component back to /auth page
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isUserAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isUserAuthenticated || !allowedRoles.includes(role!)) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
