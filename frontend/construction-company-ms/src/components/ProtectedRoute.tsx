import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";
import { RootState } from "../store/store";

// Implements protected routes for different user roles
// if user role is correct this component will return Outlet component which returns passed child
// else it will return navigation component back to /auth page
interface ProtectedProps {
  admin_route: boolean;
}

const ProtectedRoute: React.FC<ProtectedProps> = ({ admin_route }) => {
  const { isUserAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isUserAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (admin_route && role === "worker") {
    return <Navigate to="/dashboard" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
