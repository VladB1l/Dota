import express from 'express';
import fetch from 'node-fetch';
import { STRATZ_API_KEY } from '../config.js';

const router = express.Router();
const STRATZ_API_URL = 'https://api.stratz.com/graphql';

router.get('/player/:steamId', async (req, res) => {
    const steamId32 = req.params.steamId;

    const query = `
    query {
      player(steamAccountId: ${steamId32}) {
        steamAccountId
        matchCount
        winCount
        steamAccount {
          name
          avatar
          countryCode
          seasonRank
          smurfFlag
          lastMatchDateTime
          communityVisibleState
          isAnonymous
        }
        matches(request: {
          take: 100
          orderBy: DESC
        }) {
          id
          gameMode
          startDateTime
          durationSeconds
          rank
          players(steamAccountId: ${steamId32}) {
            isVictory
            kills
            assists
            deaths
            imp
            award
            heroId
            lane
            position
          }
        }
      }
    }
  `;

    try {
        console.log('[playerRoute] Отправка запроса к Stratz API...');
        const response = await fetch(STRATZ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRATZ_API_KEY}`,
                'User-Agent': 'STRATZ_API'
            },
            body: JSON.stringify({ query })
        });
        const result = await response.json();

        if (!result.data || !result.data.player) {
            console.error('[playerRoute] Нет данных в ответе от Stratz:', result);
            return res.status(502).json({ error: 'No data from Stratz API' });
        }

        console.log('[playerRoute] Успешно получен игрок:', result.data.player.steamAccountId);
        res.json(result.data.player);

    } catch (err) {
        console.error('[playerRoute] Ошибка при запросе к Stratz API:', err);
        res.status(500).json({ error: 'Ошибка получения игрока' });
    }
});

export default router;
