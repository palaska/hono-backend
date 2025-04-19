import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

import type { Db } from "@/db";
// We need to import the user schema type
// import type { users } from "@/db/users.schema";
import type { Environment } from "@/env";

// Create a type for the user based on the schema table
// type User = typeof users.$inferSelect;

export interface AppBindings {
  Bindings: Environment;
  Variables: {
    logger: PinoLogger;
    // better-auth
    auth?: any;
    user?: any;
    session?: any;

    db?: Db; // Database will be attached by the db middleware
  };
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
