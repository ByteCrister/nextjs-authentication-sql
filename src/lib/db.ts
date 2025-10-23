import mysql, { Pool } from "mysql2/promise";

const url = new URL(process.env.DATABASE_URL!);

// Prevent multiple pool instances during Next.js hot reload
const pool: Pool =
    globalThis._pool ??
    (globalThis._pool = mysql.createPool({
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        port: Number(url.port) || 3306,
        connectionLimit: 10,
    }));

export const db = pool;
export type { Pool };