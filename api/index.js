import express from 'express';
import serverless from 'serverless-http';
import userRoutes from '../routes/userRoutes.js';
import movieRoutes from '../routes/movieRoutes.js';
import seriesRoutes from '../routes/seriesRoutes.js';
import walletRoutes from '../routes/walletRoutes.js';
import coinkeyRoutes from '../routes/coinkeyRoutes.js';
import collectionRoutes from '../routes/collectionRoutes.js';
import cors from 'cors';
import { waitUntil } from '@vercel/functions';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const app = express();
const port = 4000;

// Rate Limiting Setup (5 requests per 1 second)
const rateLimiter = new RateLimiterMemory({
  points: 5, // Max 5 requests
  duration: 10, // Duration in seconds
});

// Middleware to parse JSON
app.use(express.json());

// CORS Setup
const allowedOrigins = [
  'http://localhost:8080', // Your local frontend
  'http://localhost:5173', // Your local frontend
  'https://your-frontend.com', // Your production frontend
  'https://accounts.google.com', // Google accounts
  'https://www.googleapis.com', // Google APIs
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies if needed
}));

// Rate Limiting Middleware (applies to all routes)
app.use((req, res, next) => {
  const ip = req.ip; // Get client IP address

  rateLimiter.consume(ip)
    .then(() => {
      next(); // Proceed to the next middleware/route handler
    })
    .catch(() => {
      res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    });
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/coinkey', coinkeyRoutes);

// Handle requests to /api
app.get('/api', (req, res) => {
  res.send('Welcome to Piratecoin! Toranaga thanks you for supporting us. The project aims to make motion pictures affordable, easily accessible to everyone and curb pirating of content. Happy content sharing folks!!!');
});

// Export the serverless version for Vercel
export default serverless(app);

// Local development server (if you run locally)
app.listen(port, () => {
  console.log(`We are listening at http://localhost:${port}`);
});
