import { Router } from 'express';
import fetch from 'node-fetch';
import pool from '../db.js';
import { STRATZ_API_KEY } from '../config.js';

const router = Router();

const STRATZ_API_URL = 'https://api.stratz.com/graphql';

function aggregateWinData(winDayData) {
  const aggregated = {};

  for (const entry of winDayData) {
    const { heroId, winCount, matchCount } = entry;

    if (!aggregated[heroId]) {
      aggregated[heroId] = { heroId, winCount: 0, matchCount: 0 };
    }

    aggregated[heroId].winCount += winCount;
    aggregated[heroId].matchCount += matchCount;
  }

  return Object.values(aggregated);
}

async function fetchMetaFromStratz() {
  const query = `
    query {
      heroStats {
        pos1: winDay(positionIds: [POSITION_1], bracketIds: [IMMORTAL], gameModeIds: [ALL_PICK_RANKED]) {
          day heroId winCount matchCount
        }
        pos2: winDay(positionIds: [POSITION_2], bracketIds: [IMMORTAL], gameModeIds: [ALL_PICK_RANKED]) {
          day heroId winCount matchCount
        }
        pos3: winDay(positionIds: [POSITION_3], bracketIds: [IMMORTAL], gameModeIds: [ALL_PICK_RANKED]) {
          day heroId winCount matchCount
        }
        pos4: winDay(positionIds: [POSITION_4], bracketIds: [IMMORTAL], gameModeIds: [ALL_PICK_RANKED]) {
          day heroId winCount matchCount
        }
        pos5: winDay(positionIds: [POSITION_5], bracketIds: [IMMORTAL], gameModeIds: [ALL_PICK_RANKED]) {
          day heroId winCount matchCount
        }
      }
    }
  `;

  const response = await fetch(STRATZ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRATZ_API_KEY}`,
      'User-Agent': 'STRATZ_API',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Stratz API не отвечает');
  }

  const result = await response.json();

  if (!result.data) {
    throw new Error('Ошибка получения данных из Stratz API');
  }

  return result.data.heroStats;
}

async function updateMetaStats() {
  const metaData = await fetchMetaFromStratz();

  await pool.query('DELETE FROM hero_meta_stats');
  const positions = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5'];

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const aggregated = aggregateWinData(metaData[position]);

    for (const hero of aggregated) {
      await pool.query(
        `INSERT INTO hero_meta_stats (hero_id, win_count, match_count, position_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [hero.heroId, hero.winCount, hero.matchCount, i + 1]
      );
    }
  }
}

// Получить мету с джойном данных о героях
router.get('/meta', async (req, res) => {
  try {
    // Получаем дату последней записи
    const { rows: [latest] } = await pool.query(`
      SELECT MAX(created_at) as last_update FROM hero_meta_stats
    `);

    const today = new Date().toISOString().split('T')[0]; // формат: yyyy-mm-dd
    const lastUpdateDate = latest?.last_update?.toISOString().split('T')[0];

    // Если данных нет или они устарели — обновляем
    if (!lastUpdateDate || lastUpdateDate !== today) {
      console.log('Обновление меты — устаревшие данные');
      await updateMetaStats();
    }

    const result = await pool.query(`
      SELECT 
        hero_meta_stats.hero_id,
        hero_meta_stats.win_count,
        hero_meta_stats.match_count,
        hero_meta_stats.position_id,
        heroes.display_name,
        heroes.short_name
      FROM hero_meta_stats
      JOIN heroes ON heroes.id = hero_meta_stats.hero_id
      ORDER BY position_id ASC, (win_count::float / NULLIF(match_count, 0)) DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении меты:', error);
    res.status(500).json({ error: 'Ошибка при получении меты' });
  }
});


router.post('/meta', async (req, res) => {
  try {
    await updateMetaStats();
    res.status(200).json({ message: 'Мета успешно обновлена' });
  } catch (error) {
    console.error('Ошибка при обновлении меты:', error);
    res.status(500).json({ error: 'Ошибка при обновлении меты' });
  }
});

export default router;
