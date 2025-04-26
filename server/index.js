import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

import { runImpactOptimization } from './optimizer.js';
import { STRATZ_API_KEY } from './config.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const apiKey = `${STRATZ_API_KEY}`;

app.post('/match', async (req, res) => {
  const { matchId } = req.body;
  const query = `{
    match(id: ${matchId}) {
      id radiantKills direKills durationSeconds didRadiantWin
      players {
        steamAccount { name }
        hero { id displayName shortName }
        isRadiant kills deaths assists
        goldPerMinute experiencePerMinute heroDamage
        towerDamage heroHealing numLastHits role imp
      }
    }
  }`;

  try {
    const response = await fetch('https://api.stratz.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    res.json({ match: data.data.match });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении матча' });
  }
});

app.post('/optimize', async (req, res) => {
  try {
    const { players } = req.body;
    const result = await runImpactOptimization(players);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при оптимизации' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
