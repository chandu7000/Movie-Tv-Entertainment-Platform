require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');
const { validateEnvironment } = require('./config/env');

const port = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    validateEnvironment();
    await connectDatabase();
    app.listen(port, () => console.log(`CineVerse API listening on port ${port}`));
  } catch (error) {
    console.error('Unable to start CineVerse API:', error.message);
    process.exit(1);
  }
};

start();
