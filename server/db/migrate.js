import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Applies db/schema.sql (idempotent CREATE TABLE IF NOT EXISTS statements).
 * Retries while the database is still starting up, so the app can be started
 * at the same time as MySQL (e.g. after a server reboot) without crashing.
 */
export async function migrate({retries = 30, delayMs = 2000} = {}) {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    for (let attempt = 1; ; attempt++) {
        try {
            const conn = await mysql.createConnection({
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                multipleStatements: true,
            });
            await conn.query(schema);
            await conn.end();
            console.log('[migrate] Schema is up to date');
            return;
        } catch (err) {
            if (attempt >= retries) throw err;
            console.log(`[migrate] Database not ready (${err.code || err.message}), retry ${attempt}/${retries}...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}
