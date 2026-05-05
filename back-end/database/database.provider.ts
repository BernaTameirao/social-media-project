// src/database/database.provider.ts
import { Pool } from 'pg';

export const databaseProvider = {
  provide: 'PG_POOL',
  useFactory: async () => {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });

    return pool;
  },
};