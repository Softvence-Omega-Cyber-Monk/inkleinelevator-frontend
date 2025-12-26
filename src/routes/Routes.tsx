import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Form from "@/pages/Form";
import Services from "@/pages/Services";
import HoeItWorks from "@/pages/HoeItWorks";
import Success from "@/pages/SuccessStory";
import UserRoutes from "./UserRoutes";
import UserDashboard from "@/pages/UserDashboard/UserDashboard";
import UserDashboardOverview from "@/pages/UserDashboard/UserDashboardOverview";
import MyJobs from "@/pages/UserDashboard/MyJobs/MyJobs";
import MessagesPage from "@/pages/UserDashboard/Meassage/MessagesPage";
import SettingOverview from "@/pages/UserDashboard/Seetings/SettingOverview";
import ElevatorRouter from "./ElevatorRouter";
import ElevatorDashboard from "@/pages/ElevatorDashboard/ElevatorDashboard";
import ElevatorDashboardOverview from "@/pages/ElevatorDashboard/ElevatorDashboardOverview";
import AdminRouter from "./AdminRouter";
import AdminDashboard from "@/pages/AdminDashboard/AdminDashboard";
import AdminDashboardOverview from "@/pages/AdminDashboard/AdminDashboardOverview";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/form",
        element: <Form />,
      },
      {
        path: "/how-it-works",
        element: <HoeItWorks />
      },
      {
        path: "/success-stories",
        element: <Success />
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/user",
    element: <UserRoutes />,
    children: [
      {
        path: "",
        element: <UserDashboard />,
        children: [
          { path: "", element: <UserDashboardOverview /> },  // Add this!
          { path: "my-jobs", element: <MyJobs /> },
          { path: "message", element: <MessagesPage /> },
          { path: "setting", element: <SettingOverview /> }
        ]
      }
    ]
  },
  {
    path: "/elevator",
    element: <ElevatorRouter />,
    children: [
      {
        path: "",
        element: <ElevatorDashboard />,
        children: [
          { path: "", element: <ElevatorDashboardOverview /> }
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminRouter />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
        children: [
          { path: "", element: <AdminDashboardOverview /> }
        ]
      }
    ]
  },

]);

export default routes;
