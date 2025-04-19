import type { Context, MiddlewareHandler } from "hono";
import type { Env } from "hono-pino";

import { pinoLogger as logger } from "hono-pino";
import { randomUUID } from "node:crypto";
import pino from "pino";

import type { AppBindings } from "@/lib/types";

export function pinoLogger() {
  return ((c, next) => {
    // Safely determine if we should use pretty logger
    const isPrettyLogger = c.env.NODE_ENV !== "production";
    const transport = isPrettyLogger
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined;

    return logger({
      pino: pino({
        level: c.env.LOG_LEVEL || "info",
        transport,
      }),
      http: {
        reqId: () => randomUUID(),
      },
    })(c as unknown as Context<Env>, next);
  }) satisfies MiddlewareHandler<AppBindings>;
}
