import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth.route";
import tasks from "@/routes/tasks/tasks.index";

const app = createApp();

configureOpenAPI(app);

const routes = [auth, tasks] as const;

routes.forEach((route) => {
  app.route("/api/", route);
});

export type AppType = typeof routes[number];

export default app;
