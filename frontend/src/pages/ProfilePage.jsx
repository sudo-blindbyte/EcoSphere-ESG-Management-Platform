import React, { useState } from 'react';

function ProfilePage({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password: password || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Profile details updated successfully!');
        onUserUpdate(data.user); // trigger state sync in App.jsx
        setPassword('');
      } else {
        setError(data.message || 'Failed to update profile details.');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>👤 Employee Profile</h1>
      
      {msg && <div style={{ color: 'var(--color-env)', marginBottom: '1rem', fontWeight: 'bold' }}>{msg}</div>}
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

      <div className="data-table-container" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-env)' }}>Update Account Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password (Optional)</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave blank to keep current password" 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current XP Balance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-game)', marginTop: '0.25rem' }}>⚡ {user?.xp || 0} XP</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Security Role</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gov)', marginTop: '0.25rem', textTransform: 'capitalize' }}>🛡️ {user?.role || 'user'}</div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-env) 0%, #065f46) 100%' }}>
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
