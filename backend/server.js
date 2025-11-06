import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://team-barbaad-ecommerce-store.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Remove the origin check middleware since CORS handles it
app.use(express.json());

// Better request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Add health check endpoint
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Warmup endpoint
app.get('/warmup', async (req, res) => {
  try {
    // Test database connection
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ status: 'warmed up' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
