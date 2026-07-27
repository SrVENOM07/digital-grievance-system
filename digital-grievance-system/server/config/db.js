const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grievance_db';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    // Set connection timeout to 3 seconds so we can fall back quickly if local Mongo isn't running
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Standard MongoDB connection failed (${error.message}).`);
    console.log('🔄 Initializing in-memory MongoDB fallback server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected successfully at ${mongoUri}`);
    } catch (memErr) {
      console.error(`❌ Could not start MongoDB connection: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
