import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { ConversationRoutes } from "../modules/conversation/conversation.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/conversation",
    route: ConversationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
