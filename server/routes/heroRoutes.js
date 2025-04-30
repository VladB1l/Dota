import express from 'express';
import pool from '../db.js';
import fetch from 'node-fetch';
import { STRATZ_API_KEY } from '../config.js';

const router = express.Router();
const apiKey = STRATZ_API_KEY;

async function fetchHeroesFromStratz() {
    const query = `{
      constants {
        heroes(language: ENGLISH) {
          id
          displayName
          shortName
          stats {
            attackType
            primaryAttribute
            strengthBase
            agilityBase
            intelligenceBase
            strengthGain
            agilityGain
            intelligenceGain
            attackRange
            attackRate
            startingArmor
            moveSpeed
            hpRegen
            mpRegen
          }
          language {
            lore
            hype
          }
          gameVersionId
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

    const text = await response.text();

    try {
        const json = JSON.parse(text);
        return json.data.constants.heroes;
    } catch (error) {
        console.error('Ошибка парсинга ответа от Stratz. Ответ сервера:', text);
        throw new Error('Некорректный ответ от Stratz API');
    }
}

router.get('/heroes', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM heroes');

        if (rows.length > 0) {
            res.json(rows);
        } else {
            console.log('Героев нету в базе')
            const heroes = await fetchHeroesFromStratz();

            for (const hero of heroes) {
                await pool.query(
                    `INSERT INTO heroes 
                    (id, display_name, short_name, attack_type, primary_attribute, strength_base, agility_base, intelligence_base, strength_gain, agility_gain, intelligence_gain, attack_range, attack_rate, starting_armor, move_speed, hp_regen, mp_regen, lore, hype, game_version_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
                    [
                        hero.id,
                        hero.displayName,
                        hero.shortName,
                        hero.stats?.attackType || null,
                        hero.stats?.primaryAttribute || null,
                        hero.stats?.strengthBase || null,
                        hero.stats?.agilityBase || null,
                        hero.stats?.intelligenceBase || null,
                        hero.stats?.strengthGain || null,
                        hero.stats?.agilityGain || null,
                        hero.stats?.intelligenceGain || null,
                        hero.stats?.attackRange || null,
                        hero.stats?.attackRate || null,
                        hero.stats?.startingArmor || null,
                        hero.stats?.moveSpeed || null,
                        hero.stats?.hpRegen || null,
                        hero.stats?.mpRegen || null,
                        hero.language?.lore || null,
                        hero.language?.hype || null,
                        hero.gameVersionId || null,
                    ]
                );
            }

            const { rows: insertedRows } = await pool.query('SELECT * FROM heroes');
            res.json(insertedRows);
        }
    } catch (error) {
        console.error('Ошибка получения героев:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении героев' });
    }
});

export default router;
