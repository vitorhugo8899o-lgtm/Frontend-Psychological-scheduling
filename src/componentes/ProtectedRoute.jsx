import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext'


const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <ThemeProvider>
            <Outlet />
        </ThemeProvider>
    )
};

export default ProtectedRoute;