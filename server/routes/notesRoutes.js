import express from 'express';
import pool from '../db.js';

const router = express.Router();


router.get('/match-notes/:userId/:matchId', async (req, res) => {
    const { userId, matchId } = req.params;

    try {
        const result = await pool.query(
            'SELECT note FROM match_notes WHERE user_id = $1 AND match_id = $2',
            [userId, matchId]
        );

        if (result.rows.length > 0) {
            res.json({ note: result.rows[0].note });
        } else {
            res.json({});
        }
    } catch (err) {
        console.error('Error fetching match note:', err);
        res.status(500).json({ error: 'Server error while fetching match note' });
    }
});


router.post('/match-notes', async (req, res) => {
    const { userId, matchId, note } = req.body;

    try {
        await pool.query(
            `INSERT INTO match_notes (user_id, match_id, note)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, match_id)
       DO UPDATE SET note = EXCLUDED.note`,
            [userId, matchId, note]
        );

        res.status(200).json({ message: 'Note saved successfully' });
    } catch (err) {
        console.error('Error saving match note:', err);
        res.status(500).json({ error: 'Server error while saving match note' });
    }
});

export default router;