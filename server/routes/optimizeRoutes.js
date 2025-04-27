import express from 'express';
import { runImpactOptimization } from '../optimizer.js';

const router = express.Router();

router.post('/optimize', async (req, res) => {
    try {
        const { players } = req.body;
        const result = await runImpactOptimization(players);
        res.json(result);
    } catch (err) {
        console.error('Ошибка при оптимизации:', err);
        res.status(500).json({ error: 'Ошибка при оптимизации' });
    }
});

export default router;
