import React, { useState, useEffect } from 'react';

function DashboardPage() {
  const [kpi, setKpi] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [kpiRes, leaderboardRes] = await Promise.all([
          fetch('/api/dashboard/kpi', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/gamification/leaderboard', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const kpiData = await kpiRes.json();
        const leaderboardData = await leaderboardRes.json();
        
        if (kpiData.success) setKpi(kpiData.data);
        if (leaderboardData.success) setLeaderboard(leaderboardData.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading EcoSphere KPI Intelligence...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>🌿 ESG Executive Dashboard</h1>
      
      {/* Top KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-env">
          <div className="kpi-title">Environmental Score</div>
          <div className="kpi-value" style={{ color: 'var(--color-env)' }}>
            {kpi?.environmental?.score || 0}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            🌿 Total: {kpi?.environmental?.totalCO2e || 0} kg CO2e
          </div>
        </div>
        <div className="kpi-card kpi-soc">
          <div className="kpi-title">Social Score</div>
          <div className="kpi-value" style={{ color: 'var(--color-soc)' }}>
            {kpi?.social?.score || 0}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            🤝 {kpi?.social?.totalCSRActivities || 0} Completed CSR Activities
          </div>
        </div>
        <div className="kpi-card kpi-gov">
          <div className="kpi-title">Governance Score</div>
          <div className="kpi-value" style={{ color: 'var(--color-gov)' }}>
            {kpi?.governance?.score || 0}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            ⚖️ Policies: {kpi?.governance?.activePolicies || 0} Active
          </div>
        </div>
        <div className="kpi-card kpi-overall">
          <div className="kpi-title">Overall ESG Score</div>
          <div className="kpi-value" style={{ color: 'var(--color-game)' }}>
            {kpi?.overall?.score || 0}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            🏆 Balanced Weighted Average
          </div>
        </div>
      </div>

      {/* Main dashboard widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Leaderboard Widget */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-game)' }}>🏆 Top ESG Champions Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <div style={{
              color: 'var(--text-secondary)',
              padding: '2.5rem',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              🏆 No employees registered on the leaderboard.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>XP Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item._id}>
                    <td>#{index + 1}</td>
                    <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                    <td>{item.departmentId?.name || 'Unassigned'}</td>
                    <td style={{ color: 'var(--color-game)', fontWeight: 'bold' }}>⚡ {item.xp} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Real-time Audit & Action logs */}
        <div className="data-table-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>🌍 Environmental Goals & Action Indicators</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Active Goals Tracker</span>
                <span>{kpi?.environmental?.activeGoals || 0} Goals</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${(kpi?.environmental?.activeGoals || 0) * 10}%`, backgroundColor: 'var(--color-env)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Governance Audits</span>
                <span>{kpi?.governance?.completedAudits || 0} Completed</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${(kpi?.governance?.completedAudits || 0) * 20}%`, backgroundColor: 'var(--color-gov)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Open Compliance Issues</span>
                <span style={{ color: '#ef4444' }}>{kpi?.governance?.openComplianceIssues || 0} Pending</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${(kpi?.governance?.openComplianceIssues || 0) * 30}%`, backgroundColor: '#ef4444' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
