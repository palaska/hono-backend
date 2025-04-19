import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

// Import route types
import type { CreateRoute, GetRoute, PatchRoute, RemoveRoute, UpdateRoute } from "./dummy.routes";

// Define handlers
export const get: AppRouteHandler<GetRoute> = async (c) => {
  return c.json({ message: "This is a dummy GET endpoint" });
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  return c.json({ message: `POST request received: ${body.message}` });
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const body = c.req.valid("json");
  return c.json({ message: `PUT request received: ${body.message}` });
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const body = c.req.valid("json");
  return c.json({ message: `PATCH request received: ${body.message || "No message provided"}` });
};

export const remove: AppRouteHandler<RemoveRoute> = async (_c) => {
  return new Response(null, { status: HttpStatusCodes.NO_CONTENT });
};
