import type { Context } from "hono";

import { createRouter } from "@/lib/create-app";

function handleAuth(c: Context) {
  const auth = c.get("auth");
  return auth.handler(c.req.raw);
}

const router = createRouter()
  .post("/auth/**", handleAuth)
  .get("/auth/**", handleAuth);

export default router;
