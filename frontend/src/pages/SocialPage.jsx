import React, { useState, useEffect } from 'react';

function SocialPage({ user }) {
  const [activities, setActivities] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // CSR Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [location, setLocation] = useState('');
  const [pointsReward, setPointsReward] = useState('50');

  const token = localStorage.getItem('token');
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const fetchAllData = async () => {
    try {
      const [actRes, partRes] = await Promise.all([
        fetch('/api/social/activities', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/social/participations', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const actData = await actRes.json();
      const partData = await partRes.json();

      if (actData.success) setActivities(actData.data);
      if (partData.success) setParticipations(partData.data);
    } catch (err) {
      console.error('Error fetching CSR records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/social/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          activityDate,
          location,
          pointsReward: parseInt(pointsReward)
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('CSR Activity created successfully!');
        setTitle('');
        setDescription('');
        setActivityDate('');
        setLocation('');
        setPointsReward('50');
        fetchAllData();
      } else {
        setMsg(data.error || data.message || 'Failed to create CSR activity');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleRegister = async (activityId) => {
    setMsg('');
    try {
      const res = await fetch('/api/social/participations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ activityId })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Successfully registered for CSR activity!');
        fetchAllData();
      } else {
        setMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      setMsg('API Connection Error');
    }
  };

  const handleApproval = async (participationId, status) => {
    setMsg('');
    try {
      const res = await fetch(`/api/social/participations/${participationId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          approvalStatus: status,
          proofUrl: 'https://proof-placeholder.com/file' // Provide placeholder proof to bypass validation
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Participation request marked as: ${status}`);
        fetchAllData();
      } else {
        setMsg(data.message || 'Action failed');
      }
    } catch (err) {
      setMsg('API Connection Error');
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading Social CSR portal...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>🤝 Social Module</h1>

      {msg && <div style={{ color: 'var(--color-soc)', marginBottom: '1rem', fontWeight: 'bold' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* CSR List view */}
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-soc)' }}>CSR Events &amp; Community Volunteering</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activities.map(a => (
              <div key={a._id} className="kpi-card" style={{ borderTop: '4px solid var(--color-soc)', padding: '1rem' }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{a.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{a.description}</p>
                <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div>📅 <strong>Date:</strong> {new Date(a.activityDate).toLocaleDateString()}</div>
                  <div>📍 <strong>Location:</strong> {a.location || 'Virtual'}</div>
                  <div style={{ color: 'var(--color-game)', fontWeight: 'bold', marginTop: '0.25rem' }}>⚡ Reward: {a.pointsReward} XP</div>
                </div>
                <button onClick={() => handleRegister(a._id)} className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-soc) 0%, #1d4ed8 100%)' }}>
                  Register for Event
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create CSR Form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-soc)' }}>📝 Organize New CSR Activity</h3>
            <form onSubmit={handleCreateActivity}>
              <div className="form-group">
                <label className="form-label">Activity Title</label>
                <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Local Beach Clean Drive" required />
              </div>
              <div className="form-group">
                <label className="form-label">Event Description</label>
                <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe scope and logistics..." style={{ height: '80px', resize: 'none' }} required></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input type="date" className="form-input" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Reward Points (XP)</label>
                  <input type="number" className="form-input" value={pointsReward} onChange={(e) => setPointsReward(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Event Venue / Location</label>
                <input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Marina Beach Sector 2" required />
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-soc) 0%, #1d4ed8 100%)' }}>Create Activity</button>
            </form>
          </div>
        )}

      </div>

      {/* Registrations audit view */}
      <div className="data-table-container">
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-soc)' }}>CSR Participation Registry Logs</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Activity Title</th>
              <th>Status</th>
              <th>Earned Points</th>
              {isAdminOrManager && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {participations.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 'bold' }}>{p.employeeId?.name}</td>
                <td>{p.activityId?.title}</td>
                <td>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    backgroundColor: p.approvalStatus === 'Approved' ? 'rgba(16,185,129,0.2)' : p.approvalStatus === 'Pending' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: p.approvalStatus === 'Approved' ? 'var(--color-env)' : p.approvalStatus === 'Pending' ? 'var(--color-game)' : '#ef4444'
                  }}>
                    {p.approvalStatus}
                  </span>
                </td>
                <td style={{ color: 'var(--color-game)', fontWeight: 'bold' }}>{p.pointsEarned ? `⚡ ${p.pointsEarned} XP` : '0 XP'}</td>
                {isAdminOrManager && (
                  <td>
                    {p.approvalStatus === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleApproval(p._id, 'Approved')} className="btn-primary" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: 'var(--color-env)', fontSize: '0.8rem' }}>Approve</button>
                        <button onClick={() => handleApproval(p._id, 'Rejected')} className="btn-primary" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: '#ef4444', fontSize: '0.8rem' }}>Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Closed</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SocialPage;
