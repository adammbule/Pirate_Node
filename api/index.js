import express from 'express';
import serverless from 'serverless-http';
import userRoutes from '../routes/userRoutes.js';  // Use .js extension for ES module imports
import movieRoutes from '../routes/movieRoutes.js';
import seriesRoutes from '../routes/seriesRoutes.js';
import walletRoutes from '../routes/walletRoutes.js';
import collectionRoutes from '../routes/collectionRoutes.js';
import cors from 'cors';
import { waitUntil } from '@vercel/functions';


const app = express();
const port = 4000;

        // Middleware to parse JSON request bodies
        app.use(express.json());

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

        // Mount Routes
        app.use('/api/users', userRoutes);
        app.use('/api/movies', movieRoutes);
        app.use('/api/series', seriesRoutes);
        app.use('/api/wallet', walletRoutes);
        app.use('/api/collection', collectionRoutes);

        // Handle requests to /api
        app.get('/api', (req, res) => {
          res.send('Welcome to Piratecoin! Toranaga Summer thanks you for supporting us. The project aims to make motion pictures affordable, easily accessible to everyone and curb pirating of content. Happy content sharing folks!!! ');
        });

        export default serverless(app);

app.listen(port, () => {
  console.log(`We are listening at http://localhost:${port}`);
});
