import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db/schema/schema";
import { createClient } from "@libsql/client";
// You can specify any property from the libsql connection options
export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema,
  logger: true,
});
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle({ client: sql, schema, logger: true });
