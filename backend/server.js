const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const { router: authRoutes } = require('./routes/auth');
const environmentalRoutes = require('./routes/environmental');
const socialRoutes = require('./routes/social');
const governanceRoutes = require('./routes/governance');
const gamificationRoutes = require('./routes/gamification');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');

// Connect to Database (Local or Cloud Atlas)
connectDB();

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/environmental', environmentalRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Main base healthcheck route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date(), project: 'EcoSphere ESG' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EcoSphere ESG Backend Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
