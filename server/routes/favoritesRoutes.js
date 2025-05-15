import { Router } from 'express';
import pool from '../db.js';

const router = Router();


router.get('/favorites/:userId', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT match_id FROM favorite_matches WHERE user_id = $1',
            [req.params.userId]
        );
        res.json(rows.map((r) => r.match_id));
    } catch (err) {
        console.error('Ошибка при получении избранных:', err);
        res.status(500).json({ error: 'Ошибка при получении избранных' });
    }
});


router.post('/favorites', async (req, res) => {
    const { userId, matchId } = req.body;
    try {
        await pool.query(
            `INSERT INTO favorite_matches (user_id, match_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
            [userId, matchId]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error('Ошибка при добавлении:', err);
        res.status(500).json({ error: 'Ошибка при добавлении в избранное' });
    }
});


router.delete('/favorites', async (req, res) => {
    const { userId, matchId } = req.body;
    try {
        await pool.query(
            'DELETE FROM favorite_matches WHERE user_id = $1 AND match_id = $2',
            [userId, matchId]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error('Ошибка при удалении:', err);
        res.status(500).json({ error: 'Ошибка при удалении из избранного' });
    }
});

export default router;
