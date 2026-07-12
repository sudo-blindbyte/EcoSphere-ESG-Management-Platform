import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>🌿</span> EcoSphere ESG
      </div>
      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/environmental" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              🌱 Environmental
            </NavLink>
          </li>
          <li>
            <NavLink to="/social" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              🤝 Social
            </NavLink>
          </li>
          <li>
            <NavLink to="/governance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              ⚖️ Governance
            </NavLink>
          </li>
          <li>
            <NavLink to="/gamification" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              🏆 Gamification
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📄 Reports
            </NavLink>
          </li>
          {user?.role === 'admin' && (
            <li>
              <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                ⚙️ Settings
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <button 
        onClick={onLogout} 
        style={{
          marginTop: 'auto',
          padding: '0.75rem',
          backgroundColor: '#374151',
          border: 'none',
          borderRadius: '8px',
          color: '#f3f4f6',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}

export default Sidebar;
