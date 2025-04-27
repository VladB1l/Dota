import express from 'express';
import fetch from 'node-fetch';
import { STRATZ_API_KEY } from '../config.js';

const router = express.Router();
const apiKey = `${STRATZ_API_KEY}`;

router.post('/meta', async (req, res) => {
    const query = `
    {
      heroStats {
        winDay(
          positionIds: [POSITION_3]
          bracketIds: [ANCIENT, DIVINE, IMMORTAL]
          gameModeIds: [ALL_PICK_RANKED]
        ) {
          day
          heroId
          winCount
          matchCount
        }
      }
    }
  `;

    try {
        const response = await fetch('https://api.stratz.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ query }),
        });

        const json = await response.json();
        res.json(json.data.heroStats.winDay);
    } catch (err) {
        console.error('Ошибка получения State of the Meta:', err);
        res.status(500).json({ error: 'Ошибка при получении мета данных' });
    }
});

export default router;
