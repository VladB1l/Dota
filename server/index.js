import express from 'express';
import cors from 'cors';

import matchRoutes from './routes/matchRoutes.js';
import optimizeRoutes from './routes/optimizeRoutes.js';
import metaRoutes from './routes/metaRoutes.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Маршруты
app.use(matchRoutes);
app.use(optimizeRoutes);
app.use(metaRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
