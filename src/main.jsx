import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InitialPage from './LandingPage.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from './pages/UserAuth.jsx';
import AdminLoginPage from './pages/AdminAuth.jsx';
import PsychLoginPage from './pages/PsychAuth.jsx';

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
  }
])





createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routers} />
  </StrictMode>,
);
