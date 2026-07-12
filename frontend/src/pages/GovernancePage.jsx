import React, { useState, useEffect } from 'react';

function GovernancePage({ user }) {
  const [policies, setPolicies] = useState([]);
  const [audits, setAudits] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [depts, setDepts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Policy Form states
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyDesc, setPolicyDesc] = useState('');

  // Audit Form states
  const [auditTitle, setAuditTitle] = useState('');
  const [auditDept, setAuditDept] = useState('');

  // Compliance Form states
  const [issueDesc, setIssueDesc] = useState('');
  const [issueSeverity, setIssueSeverity] = useState('Medium');
  const [issueOwner, setIssueOwner] = useState('');

  const token = localStorage.getItem('token');
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const fetchAllData = async () => {
    try {
      const [polRes, audRes, compRes, deptRes, userRes] = await Promise.all([
        fetch('/api/governance/policies', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/governance/audits', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/governance/compliance', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/settings/departments', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/gamification/leaderboard', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const polData = await polRes.json();
      const audData = await audRes.json();
      const compData = await compRes.json();
      const deptData = await deptRes.json();
      const userData = await userRes.json();

      if (polData.success) setPolicies(polData.data);
      if (audData.success) setAudits(audData.data);
      if (compData.success) setCompliance(compData.data);
      if (deptData.success) setDepts(deptData.data);
      if (userData.success) setUsers(userData.data);
    } catch (err) {
      console.error('Error fetching governance details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/governance/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: policyTitle, description: policyDesc })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('ESG Policy published successfully!');
        setPolicyTitle('');
        setPolicyDesc('');
        fetchAllData();
      } else {
        setMsg(data.error || data.message || 'Failed to create policy.');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/governance/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: auditTitle,
          departmentId: auditDept,
          auditDate: new Date(),
          status: 'In Progress'
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Governance Audit scheduled!');
        setAuditTitle('');
        setAuditDept('');
        fetchAllData();
      } else {
        setMsg(data.error || data.message || 'Failed to schedule audit.');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleCreateCompliance = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/governance/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          description: issueDesc,
          severity: issueSeverity,
          owner: issueOwner,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Compliance Incident reported and flagged!');
        setIssueDesc('');
        setIssueOwner('');
        fetchAllData();
      } else {
        setMsg(data.error || data.message || 'Failed to report incident.');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleAcknowledge = async (policyId) => {
    setMsg('');
    try {
      const res = await fetch(`/api/governance/policies/${policyId}/acknowledge`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Policy acknowledged! Awarded 25 XP.');
      } else {
        setMsg(data.message || 'Already acknowledged');
      }
    } catch (err) {
      setMsg('API error');
    }
  };

  const handleResolveIssue = async (issueId) => {
    setMsg('');
    try {
      const res = await fetch(`/api/governance/compliance/${issueId}/resolve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Compliance issue marked as Resolved. Governance score recovered!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading Governance guidelines...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>⚖️ Governance Module</h1>

      {msg && <div style={{ color: 'var(--color-gov)', marginBottom: '1rem', fontWeight: 'bold' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1.2fr 0.8fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Compliance Issues */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-gov)' }}>⚠️ Compliance Incident logs</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Details</th>
                <th>Severity</th>
                <th>Owner</th>
                <th>Resolution Due</th>
                <th>Status</th>
                {isAdminOrManager && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {compliance.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 'bold' }}>{c.description}</td>
                  <td>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: c.severity === 'Critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: c.severity === 'Critical' ? '#ef4444' : 'var(--color-game)'
                    }}>
                      {c.severity}
                    </span>
                  </td>
                  <td>{c.owner?.name}</td>
                  <td>{new Date(c.dueDate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 'bold' }}>{c.status}</td>
                  {isAdminOrManager && (
                    <td>
                      {c.status !== 'Resolved' ? (
                        <button onClick={() => handleResolveIssue(c._id)} className="btn-primary" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: 'var(--color-env)', fontSize: '0.8rem' }}>Resolve</button>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Done</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Report Compliance form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-gov)' }}>📝 Report Compliance Incident</h3>
            <form onSubmit={handleCreateCompliance}>
              <div className="form-group">
                <label className="form-label">Incident Details</label>
                <input type="text" className="form-input" value={issueDesc} onChange={(e) => setIssueDesc(e.target.value)} placeholder="e.g. Safety policy breach in Sector A" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select className="form-input" value={issueSeverity} onChange={(e) => setIssueSeverity(e.target.value)} required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee Owner</label>
                  <select className="form-input" value={issueOwner} onChange={(e) => setIssueOwner(e.target.value)} required>
                    <option value="">Select Assignee...</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'var(--color-gov)' }}>File Incident Incident</button>
            </form>
          </div>
        )}

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Scheduled Audits list */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-gov)' }}>📋 ESG Verification Audits</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {audits.map(a => (
              <div key={a._id} style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{a.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  📅 Date: {new Date(a.auditDate).toLocaleDateString()}<br/>
                  👤 Auditor: {a.leadAuditor?.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Audit form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-gov)' }}>📝 Schedule Audit Review</h3>
            <form onSubmit={handleCreateAudit}>
              <div className="form-group">
                <label className="form-label">Audit Title</label>
                <input type="text" className="form-input" value={auditTitle} onChange={(e) => setAuditTitle(e.target.value)} placeholder="e.g. Q3 Energy Audit" required />
              </div>
              <div className="form-group">
                <label className="form-label">Target Department</label>
                <select className="form-input" value={auditDept} onChange={(e) => setAuditDept(e.target.value)} required>
                  <option value="">Select Department...</option>
                  {depts.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'var(--color-gov)' }}>Schedule Audit Session</button>
            </form>
          </div>
        )}

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1.2fr 0.8fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Policies */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-gov)' }}>📜 Corporate ESG Policies</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {policies.map(p => (
              <div key={p._id} className="kpi-card" style={{ borderTop: '4px solid var(--color-gov)', padding: '1rem' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{p.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Effective: {new Date(p.effectiveDate).toLocaleDateString()}</span>
                  <button onClick={() => handleAcknowledge(p._id)} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'var(--color-gov)' }}>
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Policy form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-gov)' }}>📝 Draft ESG Governance Policy</h3>
            <form onSubmit={handleCreatePolicy}>
              <div className="form-group">
                <label className="form-label">Policy Title</label>
                <input type="text" className="form-input" value={policyTitle} onChange={(e) => setPolicyTitle(e.target.value)} placeholder="e.g. Anti-corruption standard" required />
              </div>
              <div className="form-group">
                <label className="form-label">Policy Content Details</label>
                <textarea className="form-input" value={policyDesc} onChange={(e) => setPolicyDesc(e.target.value)} placeholder="Detail standard, code of conduct and rules..." style={{ height: '100px', resize: 'none' }} required></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'var(--color-gov)' }}>Publish ESG Policy</button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}

export default GovernancePage;
