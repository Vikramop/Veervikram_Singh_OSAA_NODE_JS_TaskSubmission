const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const { loginLimiter } = require('./middlewares/rateLimiter');

require('dotenv').config();
app.use(express.json());

app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/token', loginLimiter, tokenRoutes);

module.exports = app;
