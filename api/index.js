import express from 'express';
import serverless from 'serverless-http';
import userRoutes from '../routes/userRoutes.js';
import movieRoutes from '../routes/movieRoutes.js';
import seriesRoutes from '../routes/seriesRoutes.js';
import walletRoutes from '../routes/walletRoutes.js';
import coinkeyRoutes from '../routes/coinkeyRoutes.js';
import coinKeyRentalRoutes from '../routes/coinKeyRentalRoutes.js';
import collectionRoutes from '../routes/collectionRoutes.js';
import cors from 'cors';
import { waitUntil } from '@vercel/functions';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import transactionRoutes from '../routes/transactionRoutes.js';

const app = express();
const port = 4000;

// Rate Limiting Setup (5 requests per 10 seconds)
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 2,
});

// Middleware to parse JSON
app.use(express.json());

// CORS Setup - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  credentials: false, // Set to true if you want to allow cookies; needs a specific origin then
}));

// Rate Limiting Middleware
app.use((req, res, next) => {
  const ip = req.ip;

  rateLimiter.consume(ip)
    .then(() => {
      next();
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
app.use('/api/coinkeyrental', coinKeyRentalRoutes);
app.use('/api/transactions', transactionRoutes);

// Welcome endpoint
app.get('/api', (req, res) => {
  res.send('Welcome to Piratecoin! Toranaga thanks you for supporting us. The project aims to make motion pictures affordable, easily accessible to everyone and curb pirating of content. Happy content sharing folks!!!');
});

// Export for Vercel
export default serverless(app);

// Local server
app.listen(port, () => {
  console.log(`We are listening at http://localhost:${port}`);
});
