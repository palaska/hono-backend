import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/api/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Tasks API",
      description: "API for task management with both JWT and session-based authentication",
    },
  });

  app.get(
    "/api/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
      spec: {
        url: "/api/doc",
      },
    }),
  );
}
