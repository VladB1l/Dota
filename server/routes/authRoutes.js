// server/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import session from 'express-session';
import { STEAM_API_KEY } from '../config.js';

const router = express.Router();

// Passport session setup
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Steam Strategy
passport.use(new SteamStrategy(
    {
        returnURL: 'http://localhost:4000/auth/steam/return',
        realm: 'http://localhost:4000/',
        apiKey: STEAM_API_KEY,
    },
    function (identifier, profile, done) {
        process.nextTick(() => {
            return done(null, profile);
        });
    }
));

// Инициализация сессий и passport
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());

// Роуты авторизации
router.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    }
);

router.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000'); // редиректим обратно на фронт после логина
    }
);

// Получение информации о пользователе
router.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

// Выход
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('http://localhost:3000');
    });
});

export default router;
