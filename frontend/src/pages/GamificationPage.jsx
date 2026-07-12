import React, { useState, useEffect } from 'react';

function GamificationPage({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Challenge Form States
  const [chTitle, setChTitle] = useState('');
  const [chDesc, setChDesc] = useState('');
  const [chXp, setChXp] = useState('');
  const [chDifficulty, setChDifficulty] = useState('Medium');

  // Badge Form States
  const [bgName, setBgName] = useState('');
  const [bgDesc, setBgDesc] = useState('');
  const [bgThreshold, setBgThreshold] = useState('');

  // Reward Form States
  const [rwName, setRwName] = useState('');
  const [rwDesc, setRwDesc] = useState('');
  const [rwPoints, setRwPoints] = useState('');
  const [rwStock, setRwStock] = useState('');

  const token = localStorage.getItem('token');
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const fetchData = async () => {
    try {
      const [chRes, bgRes, rwRes] = await Promise.all([
        fetch('/api/gamification/challenges', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/gamification/badges', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/gamification/rewards', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const chData = await chRes.json();
      const bgData = await bgRes.json();
      const rwData = await rwRes.json();

      if (chData.success) setChallenges(chData.data);
      if (bgData.success) setBadges(bgData.data);
      if (rwData.success) setRewards(rwData.data);
    } catch (err) {
      console.error('Error fetching gamification data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleJoinChallenge = async (challengeId) => {
    setMsg('');
    try {
      const res = await fetch(`/api/gamification/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Successfully joined the challenge! Complete milestones to claim your XP.');
      } else {
        setMsg(data.message || 'Failed to join challenge.');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleRedeem = async (rewardId) => {
    setMsg('');
    try {
      const res = await fetch(`/api/gamification/rewards/${rewardId}/redeem`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message || 'Reward redeemed successfully!');
        fetchData();
      } else {
        setMsg(data.message || 'Redemption failed. Check your XP balance.');
      }
    } catch (err) {
      setMsg('API Error.');
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/gamification/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: chTitle, description: chDesc, xp: chXp, difficulty: chDifficulty })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Sustainability Challenge created successfully!');
        setChTitle('');
        setChDesc('');
        setChXp('');
        fetchData();
      } else {
        setMsg(data.error || data.message || 'Failed to create challenge.');
      }
    } catch (err) {
      setMsg('API error.');
    }
  };

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/gamification/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: bgName, description: bgDesc, xpThreshold: bgThreshold })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Achievement Badge registered successfully!');
        setBgName('');
        setBgDesc('');
        setBgThreshold('');
        fetchData();
      } else {
        setMsg(data.error || data.message || 'Failed to create badge.');
      }
    } catch (err) {
      setMsg('API error.');
    }
  };

  const handleCreateReward = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/gamification/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: rwName, description: rwDesc, pointsRequired: rwPoints, stock: rwStock })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Marketplace Reward created successfully!');
        setRwName('');
        setRwDesc('');
        setRwPoints('');
        setRwStock('');
        fetchData();
      } else {
        setMsg(data.error || data.message || 'Failed to create reward.');
      }
    } catch (err) {
      setMsg('API error.');
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading ESG Gamification modules...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>🏆 Gamification Module</h1>

      {msg && <div style={{ color: 'var(--color-game)', marginBottom: '1rem', fontWeight: 'bold' }}>{msg}</div>}

      {/* Challenges Section */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-game)' }}>🎯 Active Sustainability Challenges</h3>
      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1.2fr 0.8fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {challenges.map(c => (
              <div key={c._id} className="kpi-card" style={{ borderTop: '4px solid var(--color-game)' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{c.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{c.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--color-game)', fontWeight: 'bold' }}>⚡ {c.xp} XP</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.difficulty}</span>
                </div>
                <button onClick={() => handleJoinChallenge(c._id)} className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-game) 0%, #d97706 100%)' }}>
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Challenge Form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-game)' }}>📝 Create New Challenge</h4>
            <form onSubmit={handleCreateChallenge}>
              <div className="form-group">
                <label className="form-label">Challenge Title</label>
                <input type="text" className="form-input" value={chTitle} onChange={(e) => setChTitle(e.target.value)} placeholder="e.g. No Plastic Week" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={chDesc} onChange={(e) => setChDesc(e.target.value)} placeholder="Define challenge tasks..." style={{ height: '60px', resize: 'none' }} required></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">XP Reward</label>
                  <input type="number" className="form-input" value={chXp} onChange={(e) => setChXp(e.target.value)} placeholder="e.g. 150" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-input" value={chDifficulty} onChange={(e) => setChDifficulty(e.target.value)} required>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'var(--color-game)' }}>Publish Challenge</button>
            </form>
          </div>
        )}
      </div>

      {/* Badges Section */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>🏅 Auto-Unlocked Achievement Badges</h3>
      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1.2fr 0.8fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <div className="badge-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {badges.map(b => (
              <div key={b._id} className="badge-card">
                <div className="badge-icon">{b.icon === 'fa-leaf' ? '🌱' : b.icon === 'fa-globe' ? '🌍' : b.icon === 'fa-recycle' ? '♻️' : '🏆'}</div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{b.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{b.description}</p>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', color: 'var(--color-game)' }}>
                  Unlock: {b.unlockRule}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create Badge Form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-env)' }}>📝 Create Achievement Badge</h4>
            <form onSubmit={handleCreateBadge}>
              <div className="form-group">
                <label className="form-label">Badge Name</label>
                <input type="text" className="form-input" value={bgName} onChange={(e) => setBgName(e.target.value)} placeholder="e.g. Eco Warrior" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={bgDesc} onChange={(e) => setBgDesc(e.target.value)} placeholder="Unlock rule explanation..." required />
              </div>
              <div className="form-group">
                <label className="form-label">XP Threshold</label>
                <input type="number" className="form-input" value={bgThreshold} onChange={(e) => setBgThreshold(e.target.value)} placeholder="e.g. 500" required />
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'var(--color-env)' }}>Register Badge</button>
            </form>
          </div>
        )}
      </div>

      {/* Rewards Catalog */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-soc)' }}>🛍️ Eco-Rewards Marketplace</h3>
      <div style={{ display: 'grid', gridTemplateColumns: isAdminOrManager ? '1.2fr 0.8fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {rewards.map(r => (
              <div key={r._id} className="kpi-card" style={{ borderTop: '4px solid var(--color-soc)' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{r.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{r.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--color-game)', fontWeight: 'bold', fontSize: '1.2rem' }}>⚡ {r.pointsRequired} XP</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stock: {r.stock} left</span>
                </div>
                <button onClick={() => handleRedeem(r._id)} className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-soc) 0%, #1d4ed8 100%)' }}>
                  Redeem Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Reward Form */}
        {isAdminOrManager && (
          <div className="data-table-container">
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-soc)' }}>📝 Create Marketplace Reward</h4>
            <form onSubmit={handleCreateReward}>
              <div className="form-group">
                <label className="form-label">Reward Item Name</label>
                <input type="text" className="form-input" value={rwName} onChange={(e) => setRwName(e.target.value)} placeholder="e.g. Eco Tote Bag" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={rwDesc} onChange={(e) => setRwDesc(e.target.value)} placeholder="Define merchandise items..." required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Required XP</label>
                  <input type="number" className="form-input" value={rwPoints} onChange={(e) => setRwPoints(e.target.value)} placeholder="e.g. 200" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input type="number" className="form-input" value={rwStock} onChange={(e) => setRwStock(e.target.value)} placeholder="e.g. 10" required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ background: 'var(--color-soc)' }}>Publish Reward</button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}

export default GamificationPage;
