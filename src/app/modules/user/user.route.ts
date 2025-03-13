import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import {
  userUpdateValidationSchema,
  userValidationSchema,
} from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidationSchema),
  UserController.registerUser
);

router.get("/getMe", auth(), UserController.getMe);

router.get("/find-user", auth(), UserController.findUser);

router.patch(
  "/update",
  auth(),
  validateRequest(userUpdateValidationSchema),
  UserController.updateUser
);

router.get("/", auth(), UserController.getAllUser);

router.get("/:id", auth(), UserController.getAUser);

export const UserRoutes = router;
