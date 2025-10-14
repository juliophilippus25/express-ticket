import express from "express";
import {
  createTheater,
  getTheaters,
} from "../../controllers/theaterController";
import { validateRequest } from "../../middlewares/validateRequest";
import { theaterSchema } from "../../utils/zodSchema";

const theaterRouter = express.Router();

theaterRouter.get("/", getTheaters);
theaterRouter.post("/", validateRequest(theaterSchema), createTheater);

export default theaterRouter;
