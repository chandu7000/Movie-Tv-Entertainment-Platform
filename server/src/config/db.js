const mongoose = require('mongoose');

const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};

module.exports = connectDatabase;
