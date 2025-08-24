import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/DashboardPage';
import Loading from "./components/Loading/Loading";
import { useAuth } from './contexts/AuthContext';
import { setAuthContext } from './utils/apiInterceptor';

function App() {
  const { isAuthenticated, loading, forceLogout, setSessionExpired } = useAuth();

    useEffect(() => {
      setAuthContext({ forceLogout, setSessionExpired });
    }, [forceLogout, setSessionExpired]);
  

  if (loading) return <Loading />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard/home" replace /> : <WelcomePage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard/home" replace /> : <AuthPage mode="register" />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard/home" replace /> : <AuthPage mode="login" />
        }
      />

      {/* Protected Route */}
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
