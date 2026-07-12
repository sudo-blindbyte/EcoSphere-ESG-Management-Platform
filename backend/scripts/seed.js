const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const dotenv = require('dotenv');
const Department = require('../models/Department');
const EmissionFactor = require('../models/EmissionFactor');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');
const Category = require('../models/Category');
const Reward = require('../models/Reward');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecosphere');
    console.log('Seeding process: Connected to MongoDB.');

    // Clear existing data
    await Department.deleteMany();
    await EmissionFactor.deleteMany();
    await Badge.deleteMany();
    await Challenge.deleteMany();
    await Category.deleteMany();
    await Reward.deleteMany();

    console.log('Cleared existing records.');

    // 1. Seed Departments
    const depts = await Department.create([
      { name: 'Manufacturing', code: 'MFG', head: 'John Doe', employeeCount: 150, environmentalScore: 65, socialScore: 80, governanceScore: 85 },
      { name: 'Logistics', code: 'LOG', head: 'Jane Smith', employeeCount: 80, environmentalScore: 50, socialScore: 70, governanceScore: 75 },
      { name: 'Human Resources', code: 'HR', head: 'Alice Johnson', employeeCount: 20, environmentalScore: 80, socialScore: 90, governanceScore: 95 },
      { name: 'Finance', code: 'FIN', head: 'Bob Williams', employeeCount: 15, environmentalScore: 85, socialScore: 75, governanceScore: 90 }
    ]);
    console.log('Seeded Departments.');

    // 2. Seed Categories
    const category = await Category.create({
      name: 'Reforestation & Cleanup',
      type: 'Challenge',
      status: 'active'
    });

    // 3. Seed Challenges
    await Challenge.create([
      { title: 'Tree Plantation', category: category._id, description: 'Plant a tree in your local community park', xp: 150, deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: 'Active' },
      { title: 'Beach Cleanup', category: category._id, description: 'Collect at least 5 kg of garbage at beach drives', xp: 200, deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), status: 'Active' },
      { title: 'No Plastic Week', category: category._id, description: 'Avoid single-use plastics for 7 consecutive days', xp: 100, deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'Active' },
      { title: 'Cycle To Office', category: category._id, description: 'Cycle to the office for 5 workdays in a row', xp: 150, deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), status: 'Active' }
    ]);
    console.log('Seeded Challenges.');

    // 4. Seed Badges
    await Badge.create([
      { name: 'Green Warrior', description: 'Awarded for reaching 200 XP threshold', unlockRule: '200 XP', xpThreshold: 200 },
      { name: 'Earth Saver', description: 'Awarded for reaching 500 XP threshold', unlockRule: '500 XP', xpThreshold: 500 },
      { name: 'Carbon Hero', description: 'Awarded for reaching 1000 XP threshold', unlockRule: '1000 XP', xpThreshold: 1000 },
      { name: 'ESG Champion', description: 'Awarded for reaching 2000 XP threshold', unlockRule: '2000 XP', xpThreshold: 2000 }
    ]);
    console.log('Seeded Badges.');

    // 5. Seed Emission Factors
    await EmissionFactor.create([
      { name: 'Electricity (Grid average)', category: 'energy', scope: 'scope2', factorValue: 0.45, unit: 'kWh', sourceReference: 'IPCC 2023' },
      { name: 'Petrol Passenger Vehicle', category: 'transport', scope: 'scope1', factorValue: 0.17, unit: 'km', sourceReference: 'EPA 2023' },
      { name: 'Diesel Freight Transport', category: 'transport', scope: 'scope1', factorValue: 2.68, unit: 'liter', sourceReference: 'DEFRA 2023' },
      { name: 'General Waste to Landfill', category: 'waste', scope: 'scope3', factorValue: 0.58, unit: 'kg', sourceReference: 'IPCC 2023' }
    ]);
    console.log('Seeded Emission Factors.');

    // 6. Seed Rewards Catalog
    await Reward.create([
      { name: 'Tree Planted in Your Name', description: 'Reforestation partnership certificate', pointsRequired: 150, stock: 100 },
      { name: 'Reusable Bamboo Water Bottle', description: 'Eco friendly bottle merchandise', pointsRequired: 250, stock: 50 },
      { name: 'Extra Paid Volunteering Leave Day', description: 'Redeem points for an extra CSR day off', pointsRequired: 500, stock: 20 }
    ]);
    console.log('Seeded Rewards.');

    // 7. Seed Default Users for immediate authentication
    const User = require('../models/User');
    await User.deleteMany();
    
    // Admin user linked to Finance department
    await User.create({
      name: 'ESG Administrator',
      email: 'admin@ecosphere.com',
      password: 'adminpassword',
      role: 'admin',
      departmentId: depts[3]._id // Finance
    });

    // Employee user linked to Manufacturing department
    await User.create({
      name: 'John Green',
      email: 'employee@ecosphere.com',
      password: 'employeepassword',
      role: 'user',
      departmentId: depts[0]._id // Manufacturing
    });
    console.log('Seeded Default Users.');

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
