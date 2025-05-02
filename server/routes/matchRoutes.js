import express from 'express';
import fetch from 'node-fetch';
import { STRATZ_API_KEY } from '../config.js';

const router = express.Router();
const apiKey = STRATZ_API_KEY;

router.post('/match', async (req, res) => {
  const { matchId } = req.body;
  const query = `{
    match(id: ${matchId}) {
      id
      radiantKills
      direKills
      durationSeconds
      didRadiantWin
      radiantNetworthLeads
      radiantExperienceLeads
      predictedWinRates
      midLaneOutcome
      laneReport {
        radiant {
          midLane { meleeCount rangeCount siegeCount denyCount neutralCount }
          offLane { meleeCount rangeCount siegeCount denyCount neutralCount }
          safeLane { meleeCount rangeCount siegeCount denyCount neutralCount }
        }
        dire {
          midLane { meleeCount rangeCount siegeCount denyCount neutralCount }
          offLane { meleeCount rangeCount siegeCount denyCount neutralCount }
          safeLane { meleeCount rangeCount siegeCount denyCount neutralCount }
        }
      }
      players {
        steamAccount { id name seasonRank }
        hero { id displayName shortName }
        isRadiant
        kills
        deaths
        assists
        goldPerMinute
        experiencePerMinute
        numLastHits
        numDenies
        position
        award
        heroDamage
        towerDamage
        heroHealing
        gold
        intentionalFeeding
        stats {
          campStack
          goldPerMinute
          experiencePerMinute
          wards { time type positionX positionY }
          runes { rune action gold positionX positionY }
        }
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