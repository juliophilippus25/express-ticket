import { imageFilter, storage } from "./../utils/multer";
import { login, register } from "./../controllers/authController";
import express from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authSchema } from "../utils/zodSchema";
import multer from "multer";

const authRouter = express.Router();

const upload = multer({
  storage: storage("public/uploads/photos"),
  fileFilter: imageFilter,
});

authRouter.post(
  "/login",
  validateRequest(authSchema.omit({ name: true })),
  login
);
authRouter.post("/register", upload.single("photo"), register);

export default authRouter;
