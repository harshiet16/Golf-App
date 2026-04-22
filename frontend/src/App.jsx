import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

import Dashboard from './pages/Dashboard/Dashboard';

import Admin from './pages/Admin/Admin';
import Home from './pages/Home/Home';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Admin />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
