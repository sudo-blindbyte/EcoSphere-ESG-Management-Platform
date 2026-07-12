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
          <li>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              👤 Profile
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
      <div style={{ 
        marginTop: 'auto', 
        padding: '1rem 0.5rem', 
        borderTop: '1px solid var(--border-color)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--color-env)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold', 
            color: '#fff',
            fontSize: '0.9rem'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ 
              fontWeight: 'bold', 
              color: '#fff', 
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {user?.name || 'Eco Member'}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              🔑 {user?.role || 'User'}
            </span>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          style={{
            padding: '0.75rem',
            backgroundColor: '#374151',
            border: 'none',
            borderRadius: '8px',
            color: '#f3f4f6',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
