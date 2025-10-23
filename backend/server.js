const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

// Routes
const authRoutes = require('./routes/auth');
const billRoutes = require('./routes/bills');
const boxRoutes = require('./routes/boxes');
const shopRoutes = require('./routes/shops');
const thingSpeakRoutes = require("./routes/thingspeak");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup for frontend with credentials
app.use(cors({
  origin: ['http://localhost:5173', 'https://onion-frontend.onrender.com'],
  credentials: true, // allow cookies
}));

// Test route to check backend deployment
app.get('/', (req, res) => {
  res.send('🚀 Backend deployed successfully!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/thingspeak', thingSpeakRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
