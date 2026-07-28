const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auto Seed Function for production DBs
const autoSeed = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Empty database detected. Auto-seeding default accounts...');
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const userPassword = await bcrypt.hash('user123', salt);

      await User.create({
        name: 'System Administrator',
        email: 'admin@grievance.com',
        phone: '9876543210',
        password: adminPassword,
        role: 'ADMIN'
      });

      await User.create({
        name: 'Alex Johnson',
        email: 'user@example.com',
        phone: '9123456789',
        password: userPassword,
        role: 'USER'
      });

      console.log('✅ Auto-seed completed successfully!');
    }
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
};

// Connect Database & Run Auto Seed
connectDB().then(() => {
  autoSeed();
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Digital Grievance API Server is running smoothly' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
