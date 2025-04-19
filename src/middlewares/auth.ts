import type { RouteConfig } from "@hono/zod-openapi";
import type { Context, MiddlewareHandler, Next } from "hono";

import type { AppBindings, AppRouteHandler } from "@/lib/types";

import { configureAuth } from "@/lib/auth";

export function authMiddleware(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const db = c.get("db");

    if (!db) {
      throw new Error("Database not found");
    }

    const auth = configureAuth(db);

    c.set("auth", auth);

    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  };
}

export function isAdmin<R extends RouteConfig>(handler: AppRouteHandler<R>) {
  return (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return handler(c, next);
  };
}

export function isAuthenticated<R extends RouteConfig>(handler: AppRouteHandler<R>) {
  return (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return handler(c, next);
  };
}
