import express from 'express';
import fetch from 'node-fetch';
import { STRATZ_API_KEY } from '../config.js';

const router = express.Router();
const apiKey = `${STRATZ_API_KEY}`;

router.post('/match', async (req, res) => {
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
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'STRATZ_API',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    res.json({ match: data.data.match });
  } catch (err) {
    console.error('Ошибка получения матча:', err);
    res.status(500).json({ error: 'Ошибка при получении матча' });
  }
});

export default router;
