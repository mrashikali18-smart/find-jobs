require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

// SECURITY: Ensure DB connection completes before starting server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Find Jobs 🔎 API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
