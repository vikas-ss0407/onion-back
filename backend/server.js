const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // <-- Add this
dotenv.config();
const authRoutes = require('./routes/auth');
const billRoutes = require('./routes/bills');
const boxRoutes = require('./routes/boxes');
const shopRoutes = require('./routes/shops');
const thingSpeakRoutes = require("./routes/thingspeak");


connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS setup
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Allow the deployed frontend URL via env var; helps avoid CORS mismatches in prod
app.use(cors({
  origin: [FRONTEND_URL, 'https://onion-frontend.onrender.com'],
  credentials: true,
}));

// Optional debug middleware to log cookies for troubleshooting 401s
if (process.env.DEBUG_COOKIES === 'true') {
  app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.path, 'Cookies:', req.cookies);
    next();
  });
}

// Debug endpoint to inspect cookies/headers (only active when DEBUG_COOKIES=true)
if (process.env.DEBUG_COOKIES === 'true') {
  app.get('/api/debug/cookies', (req, res) => {
    // Return what the backend receives from the browser
    return res.json({
      cookies: req.cookies || {},
      headers: {
        cookie: req.headers.cookie || null,
        origin: req.headers.origin || null,
      },
    });
  });
}

// Test route to check backend deployment
app.get('/', (req, res) => {
  res.send('🚀 Backend deployed successfully!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/shops', shopRoutes);
app.use("/api/thingspeak", thingSpeakRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
