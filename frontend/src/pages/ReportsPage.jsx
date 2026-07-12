import React, { useState, useEffect } from 'react';

function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [txnRes, deptRes] = await Promise.all([
          fetch('/api/environmental/transactions', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/settings/departments', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const txnData = await txnRes.json();
        const deptData = await deptRes.json();

        if (txnData.success) setTransactions(txnData.data);
        if (deptData.success) setDepts(deptData.data);
      } catch (err) {
        console.error('Error loading reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    const deptMatch = !selectedDept || t.departmentId?._id === selectedDept;
    const scopeMatch = !selectedScope || t.emissionFactorId?.scope === selectedScope;
    return deptMatch && scopeMatch;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Department,Emission Factor,Quantity,Calculated CO2e,Scope\n";

    filteredTransactions.forEach(t => {
      const row = `${new Date(t.transactionDate).toLocaleDateString()},"${t.departmentId?.name || ''}","${t.emissionFactorId?.name || ''}",${t.quantity},${t.calculatedCO2e},${t.emissionFactorId?.scope || ''}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ESG_Environmental_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Compiling ESG metrics indices...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }} className="no-print">
        <h1 style={{ fontWeight: 800 }}>📄 Custom Report Builder</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handlePrint} className="btn-primary" style={{ background: 'var(--color-gov)', width: 'auto', padding: '0.6rem 1.2rem' }}>
            🖨️ Browser PDF Print
          </button>
          <button onClick={handleExportCSV} className="btn-primary" style={{ background: 'var(--color-env)', width: 'auto', padding: '0.6rem 1.2rem' }}>
            📥 Export CSV Spreadsheet
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="data-table-container no-print" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-game)' }}>🔍 Filter Environmental Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Filter Department</label>
            <select 
              className="form-input" 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {depts.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Filter GHG Scope</label>
            <select 
              className="form-input" 
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
            >
              <option value="">All Scopes</option>
              <option value="scope1">Scope 1 (Direct)</option>
              <option value="scope2">Scope 2 (Energy)</option>
              <option value="scope3">Scope 3 (Value Chain)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic report table */}
      <div className="data-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>🌱 ESG Carbon Emission Metrics</h2>
          <span style={{ color: 'var(--text-secondary)' }}>Generated on: {new Date().toLocaleDateString()}</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Department</th>
              <th>Emission Factor</th>
              <th>Quantity Used</th>
              <th>Calculated CO2e</th>
              <th>GHG Protocol Scope</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t._id}>
                <td>{new Date(t.transactionDate).toLocaleDateString()}</td>
                <td style={{ fontWeight: 'bold' }}>{t.departmentId?.name}</td>
                <td>{t.emissionFactorId?.name}</td>
                <td>{t.quantity} {t.emissionFactorId?.unit}</td>
                <td style={{ color: 'var(--color-env)', fontWeight: 'bold' }}>{Math.round(t.calculatedCO2e)} kg CO2e</td>
                <td style={{ textTransform: 'uppercase' }}>{t.emissionFactorId?.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsPage;
