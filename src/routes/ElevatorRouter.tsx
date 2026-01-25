import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/hooks";

const ElevatorRouter = () => {
  const user = useAppSelector(selectCurrentUser);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but NOT ELEVATOR role
  if (user.role !== "ELEVATOR") {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in + ELEVATOR role
  return <Outlet />;
};

export default ElevatorRouter;
