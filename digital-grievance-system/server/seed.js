const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Grievance = require('./models/Grievance');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Cleaning existing database records...');
    await User.deleteMany({});
    await Grievance.deleteMany({});

    console.log('👤 Creating seed admin and user accounts...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@grievance.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'ADMIN'
    });

    const user = await User.create({
      name: 'Alex Johnson',
      email: 'user@example.com',
      phone: '9123456789',
      password: userPassword,
      role: 'USER'
    });

    console.log('📋 Creating initial sample grievances...');
    await Grievance.create([
      {
        userId: user._id,
        title: 'Water Leakage in Science Block 2nd Floor',
        description: 'Heavy water seepage near room 204 causing slippery corridors and potential electrical safety hazard.',
        category: 'Infrastructure',
        imageUrl: '',
        status: 'Pending',
        adminRemarks: ''
      },
      {
        userId: user._id,
        title: 'Wi-Fi Disconnections in Hostel Room 402',
        description: 'Intermittent signal drops during online exams and lectures over the past 3 days.',
        category: 'Hostel',
        imageUrl: '',
        status: 'In Progress',
        adminRemarks: 'IT department team dispatched to inspect access point node.'
      }
    ]);

    console.log('====================================================');
    console.log('🎉 Seed database created successfully!');
    console.log('====================================================');
    console.log('🔑 ADMIN LOGIN:');
    console.log('   Email:    admin@grievance.com');
    console.log('   Password: admin123');
    console.log('----------------------------------------------------');
    console.log('🔑 USER LOGIN:');
    console.log('   Email:    user@example.com');
    console.log('   Password: user123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
