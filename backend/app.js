const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const adminRoutes = require('./routes/adminRoutes');

const setupSwagger = require('./swagger');

const { loginLimiter } = require('./middlewares/rateLimiter');

require('dotenv').config();

app.use(
  cors({
    origin: '*',
    // origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/token', loginLimiter, tokenRoutes);
app.use('/api/admin', adminRoutes);

setupSwagger(app);

module.exports = app;
