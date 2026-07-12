import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import EnvironmentalPage from './pages/EnvironmentalPage';
import SocialPage from './pages/SocialPage';
import GovernancePage from './pages/GovernancePage';
import GamificationPage from './pages/GamificationPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const handleLogin = (authToken, loggedInUser) => {
    setToken(authToken);
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToast(`Logged in successfully! Welcome, ${loggedInUser.name}`);
    setTimeout(() => {
      setToast('');
    }, 4000);
  };

  const handleLogout = () => {
    setToast('Logged out successfully!');
    setToken('');
    setUser(null);
    setTimeout(() => {
      setToast('');
    }, 4000);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <div className="app-container">
        {toast && (
          <div style={{
            position: 'fixed',
            top: '25px',
            right: '25px',
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--color-env)',
            padding: '0.85rem 1.5rem',
            borderRadius: '6px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.5)',
            zIndex: 99999,
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid var(--border-color)',
            animation: 'slideIn 0.2s ease-out'
          }}>
            <span>{toast.includes('out') ? '🚪' : '🔑'}</span>
            <span>{toast}</span>
          </div>
        )}
        {token && <Sidebar user={user} onLogout={handleLogout} />}
        <main className={token ? "main-content" : "auth-wrapper"}>
          <Routes>
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/dashboard"
              element={token ? <DashboardPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/environmental"
              element={token ? <EnvironmentalPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/social"
              element={token ? <SocialPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/governance"
              element={token ? <GovernancePage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/gamification"
              element={token ? <GamificationPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/reports"
              element={token ? <ReportsPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={token ? <ProfilePage user={user} onUserUpdate={handleUserUpdate} /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={token ? (user?.role === 'admin' ? <SettingsPage user={user} /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
