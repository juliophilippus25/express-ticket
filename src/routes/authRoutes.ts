import { login } from "./../controllers/authController";
import express from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authSchema } from "../utils/zodSchema";

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateRequest(authSchema.omit({ name: true })),
  login
);

export default authRouter;
