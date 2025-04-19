import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema, ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

const tags = ["Dummy"];

// Define routes
export const get = createRoute({
  path: "/dummy",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Dummy GET response",
    ),
  },
});

export const create = createRoute({
  path: "/dummy",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        message: z.string().min(1),
      }),
      "Message for POST request",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Dummy POST response",
    ),
  },
});

export const update = createRoute({
  path: "/dummy",
  method: "put",
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        message: z.string().min(1),
      }),
      "Message for PUT request",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Dummy PUT response",
    ),
  },
});

export const patch = createRoute({
  path: "/dummy",
  method: "patch",
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        message: z.string().min(1).optional(),
      }).superRefine((data, ctx) => {
        if (Object.keys(data).length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            path: [],
          });
          return false;
        }
        return true;
      }),
      "Message for PATCH request",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Dummy PATCH response",
    ),
  },
});

export const remove = createRoute({
  path: "/dummy",
  method: "delete",
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Dummy DELETE response",
    },
  },
});

// Export types for the handlers
export type GetRoute = typeof get;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
