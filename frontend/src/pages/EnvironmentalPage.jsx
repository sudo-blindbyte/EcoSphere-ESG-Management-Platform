import React, { useState, useEffect } from 'react';

function EnvironmentalPage({ user }) {
  const [factors, setFactors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depts, setDepts] = useState([]);
  const [msg, setMsg] = useState('');

  // Transaction Form states
  const [quantity, setQuantity] = useState('');
  const [factorId, setFactorId] = useState('');
  const [deptId, setDeptId] = useState('');

  // Goal Form states
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalUnit, setGoalUnit] = useState('');
  const [goalPillar, setGoalPillar] = useState('Environmental');
  const [goalDept, setGoalDept] = useState('');

  const token = localStorage.getItem('token');
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const fetchAllData = async () => {
    try {
      const [facRes, txnRes, goalRes, deptRes] = await Promise.all([
        fetch('/api/environmental/factors', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/environmental/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/environmental/goals', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/settings/departments', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const facData = await facRes.json();
      const txnData = await txnRes.json();
      const goalData = await goalRes.json();
      const deptData = await deptRes.json();

      if (facData.success) setFactors(facData.data);
      if (txnData.success) setTransactions(txnData.data);
      if (goalData.success) setGoals(goalData.data);
      if (deptData.success) setDepts(deptData.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/environmental/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentId: deptId,
          emissionFactorId: factorId,
          quantity: parseFloat(quantity),
          sourceModule: 'Manual'
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Carbon Transaction Logged & Calculated Successfully!');
        setQuantity('');
        fetchAllData();
      } else {
        setMsg(data.error || data.message || 'Failed to record transaction');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/environmental/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: goalName,
          targetValue: parseFloat(goalTarget),
          unit: goalUnit,
          pillar: goalPillar,
          departmentId: goalDept,
          startDate: new Date(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('ESG Target Created Successfully!');
        setGoalName('');
        setGoalTarget('');
        setGoalUnit('');
        fetchAllData();
      } else {
        setMsg(data.error || data.message || 'Failed to create ESG Target.');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleUpdateGoalProgress = async (goalId, newProgressValue) => {
    try {
      const res = await fetch(`/api/environmental/goals/${goalId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentValue: parseFloat(newProgressValue) })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Goal Progress Updated Live!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading Carbon Accounting systems...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>🌱 Environmental Module</h1>
      {msg && <div style={{ color: 'var(--color-env)', marginBottom: '1rem', fontWeight: 'bold' }}>{msg}</div>}

      {isAdminOrManager && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Carbon Transaction Form */}
          <div className="data-table-container">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>📝 Record Emission log</h3>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label className="form-label">Emission Factor Source</label>
                <select className="form-input" value={factorId} onChange={(e) => setFactorId(e.target.value)} required>
                  <option value="">Select Factor Source...</option>
                  {factors.map(f => (
                    <option key={f._id} value={f._id}>{f.name} ({f.factorValue} kg CO2e / {f.unit})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Operational Department</label>
                <select className="form-input" value={deptId} onChange={(e) => setDeptId(e.target.value)} required>
                  <option value="">Select Department...</option>
                  {depts.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Activity Quantity</label>
                <input type="number" className="form-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 500" required />
              </div>
              <button type="submit" className="btn-primary">Log Transaction &amp; Auto Calculate</button>
            </form>
          </div>

          {/* ESG Target Creation Form */}
          <div className="data-table-container">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>🎯 Launch New Decarbonization Target</h3>
            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label className="form-label">Goal Target Name</label>
                <input type="text" className="form-input" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="e.g. Reduce Fuel Combustion" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Limit Value</label>
                  <input type="number" className="form-input" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} placeholder="e.g. 1000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit of Measure</label>
                  <input type="text" className="form-input" value={goalUnit} onChange={(e) => setGoalUnit(e.target.value)} placeholder="e.g. kg CO2e" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pillar Focus</label>
                  <select className="form-input" value={goalPillar} onChange={(e) => setGoalPillar(e.target.value)} required>
                    <option value="Environmental">Environmental</option>
                    <option value="Social">Social</option>
                    <option value="Governance">Governance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department owner</label>
                  <select className="form-input" value={goalDept} onChange={(e) => setGoalDept(e.target.value)} required>
                    <option value="">Select Department...</option>
                    {depts.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-env) 0%, #065f46) 100%' }}>Launch Goal Target</button>
            </form>
          </div>

        </div>
      )}

      {/* Target Progress Indicators List */}
      <div className="data-table-container" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>📊 Decarbonization Targets Tracking</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {goals.map(g => {
            const percentage = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            return (
              <div key={g._id} style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                  <span>{g.name} ({g.departmentId?.name || 'All'})</span>
                  <span>{percentage}% ({g.currentValue} / {g.targetValue} {g.unit})</span>
                </div>
                <div className="progress-bar-container" style={{ marginBottom: '1rem' }}>
                  <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                {isAdminOrManager && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Update value..." 
                      style={{ padding: '0.4rem', fontSize: '0.85rem', width: '130px' }}
                      defaultValue={g.currentValue}
                      onBlur={(e) => handleUpdateGoalProgress(g._id, e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Press tab or click out to update</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carbon Transaction History Logs */}
      <div className="data-table-container">
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>📊 Historical Carbon Records Log</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Department</th>
              <th>Emission Factor</th>
              <th>Quantity</th>
              <th>Calculated CO2e</th>
              <th>Scope</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id}>
                <td>{new Date(t.transactionDate).toLocaleDateString()}</td>
                <td>{t.departmentId?.name || 'Manual'}</td>
                <td>{t.emissionFactorId?.name}</td>
                <td>{t.quantity} {t.emissionFactorId?.unit}</td>
                <td style={{ color: 'var(--color-env)', fontWeight: 'bold' }}>{Math.round(t.calculatedCO2e)} kg CO2e</td>
                <td><span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '4px' }}>{t.emissionFactorId?.scope?.toUpperCase()}</span></td>
                <td>{t.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnvironmentalPage;
