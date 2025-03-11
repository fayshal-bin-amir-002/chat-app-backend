import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { authValidationSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/login",
  validateRequest(authValidationSchema),
  AuthController.userLogin
);

export const AuthRoutes = router;
