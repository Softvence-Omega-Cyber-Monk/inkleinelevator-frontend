import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/Redux/hooks";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";

const AdminRouter = () => {
  const user = useAppSelector(selectCurrentUser);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin role
  if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default AdminRouter;
