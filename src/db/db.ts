import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
