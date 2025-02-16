import express from 'express';
import userRoutes from './routes/userRoutes.js';  // Use .js extension for ES module imports
import movieRoutes from './routes/movieRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
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
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/series', seriesRoutes);
app.use('/wallet', walletRoutes);
app.use('/collection', collectionRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
