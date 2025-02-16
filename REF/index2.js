import express from 'express';
import userRoutes from './routes/userRoutes.js'; // Note the .js extension
import movieRoutes from './routes/movieRoutes.js'; // Note the .js extension
import seriesRoutes from './routes/seriesRoutes.js'; // Note the .js extension
import walletRoutes from './routes/walletRoutes.js'; // Note the .js extension
import collectionRoutes from './routes/collectionRoutes.js'; // Note the .js extension


const app = express();
const port = 4000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/trending', seriesRoutes);
app.use('/walletHolding', walletRoutes);
app.use('/getCollectionItems', collectionRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});