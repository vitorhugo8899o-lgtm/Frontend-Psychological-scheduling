import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import LoadingScreen from '../pages/LoadingPage';
import PageNotFoundPage from '../pages/NotFoundPage';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    console.log(user)

    console.log('role:', user?.role, '| permitidos:', allowedRoles);

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <PageNotFoundPage />;
    }

    return (
        <ThemeProvider>
            <Outlet />
        </ThemeProvider>
    );
};

export default ProtectedRoute;