import type { MiddlewareHandler } from "hono";

import type { AppBindings } from "@/lib/types";

import { createDb } from "@/db";

/**
 * Middleware that attaches database to the context
 */
export function dbMiddleware(): MiddlewareHandler<AppBindings> {
  return (c, next) => {
    const { db } = createDb(c.env);

    // Attach db to context
    c.set("db", db);

    return next();
  };
}
