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
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <ClinicaHome />
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