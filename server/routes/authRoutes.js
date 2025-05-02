// server/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import { STEAM_API_KEY } from '../config.js';
import pool from '../db.js';

const router = express.Router();
const PgSession = connectPgSimple(session);

// Вспомогательная функция преобразования SteamID64 → SteamID32
function steam64To32(steamId64) {
    return Number(BigInt(steamId64) - 76561197960265728n);
}

// --- МIDDLEWARE ДЛЯ СЕССИЙ ---
router.use(session({
    store: new PgSession({
        pool: pool,           // используем ваш pool из db.js
        tableName: 'session', // по умолчанию connect-pg-simple создаст эту таблицу
    }),
    secret: 'your_secret_key',  // смените на что-то своё
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    }
}));

router.use(passport.initialize());
router.use(passport.session());

// --- PASSPORT SETUP ---
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// SteamStrategy
passport.use(new SteamStrategy(
    {
        returnURL: 'http://localhost:4000/auth/steam/return',
        realm: 'http://localhost:4000/',
        apiKey: STEAM_API_KEY,
    },
    async function (identifier, profile, done) {
        process.nextTick(async () => {
            try {
                const steamId64 = profile.id;
                const steamId32 = steam64To32(steamId64);
                const displayName = profile.displayName;
                const avatar = profile.photos[2]?.value || profile.photos[0]?.value || null;

                // Добавляем или обновляем запись в users
                const existing = await pool.query(
                    'SELECT 1 FROM users WHERE steam_id_32 = $1',
                    [steamId32]
                );

                if (existing.rowCount === 0) {
                    await pool.query(
                        `INSERT INTO users
               (steam_id_64, steam_id_32, display_name, avatar, created_at, updated_at)
             VALUES ($1, $2, $3, $4, NOW(), NOW())`,
                        [steamId64, steamId32, displayName, avatar]
                    );
                } else {
                    await pool.query(
                        `UPDATE users
                SET display_name = $1,
                    avatar       = $2,
                    updated_at   = NOW()
              WHERE steam_id_32 = $3`,
                        [displayName, avatar, steamId32]
                    );
                }

                // Прокидываем данные в req.user
                profile.steamId32 = steamId32;
                profile.avatar = avatar;
                return done(null, profile);
            } catch (err) {
                console.error('Ошибка при обработке Steam профиля:', err);
                return done(err, null);
            }
        });
    }
));

// --- ROUTES ---

// 1) Инициировать логин через Steam
router.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' })
);

// 2) Callback от Steam после логина
router.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        // успешно залогинились — редиректим на фронт
        res.redirect('http://localhost:3000');
    }
);

// 3) Получить данные текущего юзера
router.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            user: {
                displayName: req.user.displayName,
                steamId: req.user.id,
                steamId32: req.user.steamId32,
                avatar: req.user.avatar,
            }
        });
    } else {
        res.json({ user: null });
    }
});

// 4) Logout: удаляем из users и из сессии + куку
router.get('/logout', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const steamId32 = req.user.steamId32;
            await pool.query(
                'DELETE FROM users WHERE steam_id_32 = $1',
                [steamId32]
            );
        }

        req.logout(() => {
            res.clearCookie('connect.sid');
            res.redirect('http://localhost:3000');
        });
    } catch (error) {
        console.error('Ошибка при выходе из аккаунта:', error);
        res.status(500).send('Logout error');
    }
});

export default router;
