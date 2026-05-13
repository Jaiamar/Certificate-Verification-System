const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, error: { message: 'Too many requests, please try again later', code: 'RATE_LIMIT' } },
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: `Route ${req.originalUrl} not found`, code: 'NOT_FOUND' } });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'SERVER_ERROR',
      stack: err.stack,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
