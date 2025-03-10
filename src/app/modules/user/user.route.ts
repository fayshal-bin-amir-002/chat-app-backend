import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";
import { UserController } from "./user.controller";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidationSchema),
  UserController.registerUser
);

export const UserRoutes = router;
