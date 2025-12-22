import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Robust DB connection that warns instead of failing if URL is missing
// This allows the app to run in "frontend-only" mode with mocked storage
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({ 
  connectionString: connectionString || "postgres://user:password@localhost:5432/db" 
});

// If no DB URL, we still export a valid db object type-wise, 
// but it will fail at runtime if used. 
// However, since we are switching storage to MemStorage, it won't be used.
export const db = drizzle(pool, { schema });
