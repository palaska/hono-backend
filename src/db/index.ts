import type { LibSQLDatabase } from "drizzle-orm/libsql";

import { drizzle } from "drizzle-orm/libsql";

import type { Environment } from "@/env";

import * as schema from "./schema";

export type Db = LibSQLDatabase<typeof schema>;

export function createDb(env: Environment): { db: Db } {
  const db = drizzle({
    connection: {
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    },
    casing: "snake_case",
    schema,
  });

  return { db };
}
