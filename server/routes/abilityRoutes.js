import express from 'express';
import pool from '../db.js';
import fetch from 'node-fetch';
import { STRATZ_API_KEY } from '../config.js';

const router = express.Router();
const apiKey = STRATZ_API_KEY;


async function fetchAbilitiesFromStratz() {
  const query = `{
    constants {
      abilities {
        id name
        language {
          displayName
          description
          aghanimDescription
          shardDescription
          notes
        }
        stat {
          abilityId
          type
          castRange cooldown damage manaCost isUltimate duration charges chargeRestoreTime hasShardUpgrade isGrantedByShard
        }
        isTalent
        attributes {
          name
          value
          linkedSpecialBonusAbilityId
          requiresScepter
        }
      }
    }
  }`;

  const response = await fetch('https://api.stratz.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': 'STRATZ_API',
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();
  return json.data.constants.abilities;
}


router.get('/abilities', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM abilities');

    if (rows.length > 0) {
      res.json(rows);
    } else {
      const abilities = await fetchAbilitiesFromStratz();

      for (const ability of abilities) {
        await pool.query(
          `INSERT INTO abilities 
          (id, name, display_name, description, aghanim_description, shard_description, notes, type, cast_range, cooldown, damage, mana_cost, is_ultimate, duration, charges, charge_restore_time, has_shard_upgrade, is_granted_by_shard, is_talent, attributes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
          [
            ability.id,
            ability.name,
            ability.language?.displayName || null,
            ability.language?.description?.join('\n') || null,
            ability.language?.aghanimDescription || null,
            ability.language?.shardDescription || null,
            ability.language?.notes?.join('\n') || null,
            ability.stat?.type || null,
            JSON.stringify(ability.stat?.castRange || null),
            JSON.stringify(ability.stat?.cooldown || null),
            JSON.stringify(ability.stat?.damage || null),
            JSON.stringify(ability.stat?.manaCost || null),
            ability.stat?.isUltimate || false,
            ability.stat?.duration || null,
            ability.stat?.charges || null,
            ability.stat?.chargeRestoreTime || null,
            ability.stat?.hasShardUpgrade || false,
            ability.stat?.isGrantedByShard || false,
            ability.isTalent || false,
            JSON.stringify(ability.attributes || null),
          ]
        );
      }

      const { rows: insertedRows } = await pool.query('SELECT * FROM abilities');
      res.json(insertedRows);
    }
  } catch (error) {
    console.error('Ошибка получения способностей:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении способностей' });
  }
});

export default router;
