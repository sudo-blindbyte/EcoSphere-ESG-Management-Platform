import React, { useState, useEffect } from 'react';

function SettingsPage() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [head, setHead] = useState('');
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/settings/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setDepts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/settings/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, code, head })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Department registered successfully!');
        setName('');
        setCode('');
        setHead('');
        fetchDepartments();
      } else {
        setMsg(data.error || data.message || 'Failed to register department.');
      }
    } catch (err) {
      setMsg('API connection error.');
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading settings data...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>⚙️ System Settings</h1>
      
      {msg && <div style={{ color: 'var(--color-env)', marginBottom: '1rem', fontWeight: 'bold' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Department Config creation form */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>🏢 Register New ESG Department</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Department Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Supply Chain Operations" 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department Code</label>
              <input 
                type="text" 
                className="form-input" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SCO" 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Head of Department</label>
              <input 
                type="text" 
                className="form-input" 
                value={head} 
                onChange={(e) => setHead(e.target.value)}
                placeholder="e.g. Marcus Aurelius" 
                required 
              />
            </div>
            <button type="submit" className="btn-primary">Register Department</button>
          </form>
        </div>

        {/* Existing Departments */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>🏢 Configured Departments List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {depts.map(d => (
              <div key={d._id} style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{d.name} ({d.code})</span>
                  <span style={{ color: 'var(--color-env)' }}>{Math.round(d.totalScore)} ESG</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Manager: {d.head || 'N/A'}<br/>
                  Environmental Score: {d.environmentalScore} | Social Score: {d.socialScore}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
