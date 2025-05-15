import express from 'express';
import cors from 'cors';

import matchRoutes from './routes/matchRoutes.js';
import optimizeRoutes from './routes/optimizeRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import abilityRoutes from './routes/abilityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import playerRoutes from './routes/playerRoutes.js'
import favoritesRoutes from "./routes/favoritesRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(authRoutes);
app.use(matchRoutes);
app.use(optimizeRoutes);
app.use(metaRoutes);
app.use(heroRoutes);
app.use(abilityRoutes);
app.use(playerRoutes);
app.use(favoritesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
