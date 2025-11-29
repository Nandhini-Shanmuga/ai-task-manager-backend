const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB Connected Successfully');
    
  
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
