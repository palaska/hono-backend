import { createRouter } from "@/lib/create-app";
// import { admin, authenticated, maybeAttachUser } from "@/middlewares/auth.middleware";

import * as handlers from "./dummy.handlers";
import * as routes from "./dummy.routes";

// Add routes using the openapi method
const router = createRouter()
  .openapi(routes.get, handlers.get)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
