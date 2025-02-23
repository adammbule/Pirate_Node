import express from 'express';
import serverless from 'serverless-http';
import userRoutes from '../routes/userRoutes.js';  // Use .js extension for ES module imports
import movieRoutes from '../routes/movieRoutes.js';
import seriesRoutes from '../routes/seriesRoutes.js';
import walletRoutes from '../routes/walletRoutes.js';
import collectionRoutes from '../routes/collectionRoutes.js';
import cors from 'cors';


const app = express();
const port = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

const allowedOrigins = ['http://localhost:8080', 'https://your-frontend-domain.com']; // Replace with your actual frontend URL
app.use(cors({
  origin: allowedOrigins,
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
  console.log(`Server listening at http://localhost:${port}`);
});
