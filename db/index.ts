import dotenv from 'dotenv';
import * as schema from "./schema"
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg';

dotenv.config({ path: ".env.local" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
});

export const db = drizzle({ client: pool, schema: schema });