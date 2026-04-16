const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./utils/db');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
const scanRoutes = require('./routes/scan.routes');
const productsRoutes = require('./routes/products.routes');

app.use('/api/v1/scan', scanRoutes);
app.use('/api/v1/products', productsRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbOk = await db.raw('SELECT 1').then(() => true).catch(() => false);
    const status = dbOk ? 'healthy' : 'degraded';
    res.status(dbOk ? 200 : 503).json({
      status,
      services: { database: dbOk },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
