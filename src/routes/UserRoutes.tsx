import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/hooks";

const UserRoutes = () => {
  const user = useAppSelector(selectCurrentUser);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but NOT USER role
  if (user.role !== "USER") {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in + USER role
  return <Outlet />;
};

export default UserRoutes;
