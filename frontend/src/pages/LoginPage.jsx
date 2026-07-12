import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deptId, setDeptId] = useState('');
  const [depts, setDepts] = useState([]);
  
  // Forgot Password fields
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await fetch('/api/settings/departments');
        const data = await res.json();
        if (data.success) setDepts(data.data);
      } catch (err) {
        console.error('Failed to load departments');
      }
    };
    fetchDepts();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, departmentId: deptId })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Registration successful! Please login.');
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setDeptId('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Password updated successfully! Please login with your new password.');
        setIsForgotPassword(false);
        setNewPassword('');
        setPassword('');
      } else {
        setError(data.message || 'Reset failed. Verify email address.');
      }
    } catch (err) {
      setError('Server connection error.');
    }
  };

  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <form onSubmit={handleResetPasswordSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary">Reset Password</button>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
            Remember your password?{' '}
            <span 
              onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMsg(''); }} 
              style={{ color: 'var(--color-env)', cursor: 'pointer', fontWeight: '600' }}
            >
              Back to Login
            </span>
          </p>
        </form>
      );
    }

    if (isRegister) {
      return (
        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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
              placeholder="employee@company.com"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select 
              className="form-input"
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              required
            >
              <option value="">Select Department...</option>
              {depts.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">Register Account</button>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
            Already have an account?{' '}
            <span 
              onClick={() => { setIsRegister(false); setError(''); }} 
              style={{ color: 'var(--color-env)', cursor: 'pointer', fontWeight: '600' }}
            >
              Login here
            </span>
          </p>
        </form>
      );
    }

    return (
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="employee@company.com"
            required 
          />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Password</label>
            <span 
              onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMsg(''); }} 
              style={{ fontSize: '0.75rem', color: 'var(--color-env)', cursor: 'pointer', marginBottom: '0.5rem' }}
            >
              Forgot Password?
            </span>
          </div>
          <input 
            type="password" 
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Authenticate</button>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
          New to the platform?{' '}
          <span 
            onClick={() => { setIsRegister(true); setError(''); }} 
            style={{ color: 'var(--color-env)', cursor: 'pointer', fontWeight: '600' }}
          >
            Register here
          </span>
        </p>
      </form>
    );
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">🌿 EcoSphere ESG</h2>
      <p className="auth-subtitle">
        {isForgotPassword ? 'Reset password verification' : isRegister ? 'Register your ESG account' : 'Sign in to your ESG Hackathon Account'}
      </p>
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
      {successMsg && <div style={{ color: 'var(--color-env)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>{successMsg}</div>}

      {renderForm()}
    </div>
  );
}

export default LoginPage;
