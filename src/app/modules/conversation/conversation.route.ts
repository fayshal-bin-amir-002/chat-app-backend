import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

// router.post(
//   "/register",
//   validateRequest(userValidationSchema),
//   UserController.registerUser
// );

export const ConversationRoutes = router;
