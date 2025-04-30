import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',         
    host: 'localhost',         
    database: 'Dota_stats',    
    password: '123',           
    port: 5432,               
});

export default pool;
