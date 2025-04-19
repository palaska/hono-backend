import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { parseEnv } from "@/env";
import { authMiddleware } from "@/middlewares/auth";
import { dbMiddleware } from "@/middlewares/db";
import { pinoLogger } from "@/middlewares/pino-logger";

import type { AppBindings, AppOpenAPI } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(
    "*", // or replace with "*" to enable cors for all routes
    cors({
      origin: "http://localhost:3001", // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.use((c, next) => {
    // eslint-disable-next-line node/no-process-env
    c.env = parseEnv(Object.assign(c.env || {}, process.env));
    return next();
  });

  app.use(requestId())
    .use(serveEmojiFavicon("📝"))
    .use(pinoLogger())
    .use(dbMiddleware())
    .use(authMiddleware());

  app.use(csrf());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}
