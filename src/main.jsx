import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InitialPage from './LandingPage.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from './pages/UserAuth.jsx';
import AdminLoginPage from './pages/AdminAuth.jsx';
import PsychLoginPage from './pages/PsychAuth.jsx';
import ClinicaHome from './pages/HomeUser.jsx';
import ProtectedRoute from './componentes/ProtectedRoute.jsx';
import Simulation from './pages/ConsultationSimulation.jsx';
import AccountSettings from './pages/SettingsAccount.jsx';
import SearchServices from './pages/SearchService.jsx';
import AppointmentHistory from './pages/AppointmentHistory.jsx';
import ScheduleAppoiment from './pages/ScheduleAppointment.jsx';
import AppointmentsInProgress from './pages/AppointmentsInProgress.jsx';
import PaymentSuccessPage from './pages/PaymentSucess.jsx';
import ChatMira from './pages/ChatMira.jsx';
import HomeAdm from './pages/HomeAdm.jsx';
import UserList from './pages/UserLIst.jsx';
import UserInfo from './pages/UserInfo.jsx';
import AddPsych from './pages/AddPsych.jsx';
import CreateServicePage from './pages/CreateService.jsx';
import FinancialReport from './pages/FinancialReport.jsx';
import HomePsych from './pages/HomePsych.jsx';
import { AuthProvider } from './context/AuthContext.jsx';



const routers = createBrowserRouter([
  {
    path: "/",
    element: <InitialPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />
  },
  {
    path: "/auth-admin",
    element: <AdminLoginPage />
  },
  {
    path: "/auth-psych",
    element: <PsychLoginPage />
  },
  {
    path: "/payment-confirm",
    element: <PaymentSuccessPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <ClinicaHome />
      },
      {
        path: "/simulation",
        element: <Simulation />
      },
      {
        path: "/filter-services",
        element: <SearchServices />
      },
      {
        path: "/settings",
        element: <AccountSettings />
      },
      {
        path: "/history-appoiment",
        element: <AppointmentHistory />
      },
      {
        path: "/appoiment",
        element: <ScheduleAppoiment />
      },
      {
        path: "/appoiments/in-progress",
        element: <AppointmentsInProgress />
      },
      {
        path: "/chat-mira",
        element: <ChatMira />
      },
      {
        path: "/home-adm",
        element: <HomeAdm />
      },
      {
        path: "/users-list",
        element: <UserList />
      },
      {
        path: "/user-info",
        element: <UserInfo />
      },
      {
        path: "/add-psych",
        element: <AddPsych />
      },
      {
        path: "/create-service",
        element: <CreateServicePage />
      },
      {
        path: "/financial-report",
        element: <FinancialReport />
      },
      {
        path: "/home-psych",
        element: <HomePsych />
      }
    ]
  }
])





createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={routers} />
    </AuthProvider>
  </StrictMode>,
);