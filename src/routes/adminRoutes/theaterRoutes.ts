import express from "express";
import {
  createTheater,
  getTheaters,
  getTheaterDetail,
  updateTheater,
  deleteTheater,
} from "../../controllers/theaterController";
import { validateRequest } from "../../middlewares/validateRequest";
import { theaterSchema } from "../../utils/zodSchema";

const theaterRouter = express.Router();

theaterRouter.get("/", getTheaters);
theaterRouter.post("/", validateRequest(theaterSchema), createTheater);
theaterRouter.get("/:id", getTheaterDetail);
theaterRouter.put("/:id", validateRequest(theaterSchema), updateTheater);
theaterRouter.delete("/:id", deleteTheater);

export default theaterRouter;
