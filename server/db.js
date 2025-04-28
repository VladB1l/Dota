import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',         // стандартный юзер
    host: 'localhost',         // локальный сервер
    database: 'Dota_stats',    // твоя база данных
    password: '123',           // твой пароль
    port: 5432,                // стандартный порт PostgreSQL
});

export default pool;
